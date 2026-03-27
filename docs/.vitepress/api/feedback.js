// api/feedback-graphql.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { pagePath, rating, starRating, comment, url } = req.body

    const githubToken = process.env.GITHUB_TOKEN
    const repo = process.env.GITHUB_REPO
    const [owner, name] = repo.split('/')

    // Construiește titlul
    let title = ''
    if (starRating && starRating > 0) {
        const starText = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][starRating]
        title = `[${rating.toUpperCase()}] ${starRating}★ ${starText} - ${pagePath}`
    } else {
        title = `[${rating.toUpperCase()}] Feedback for ${pagePath}`
    }

    // Construiește body-ul
    const body = `
## Feedback Received

| Field | Value |
|-------|-------|
| **Page** | ${pagePath} |
| **URL** | ${url} |
| **Helpful?** | ${rating === 'good' ? '✅ Yes' : '❌ No'} |
${starRating ? `| **Rating** | ${starRating}/5 ★ (${['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][starRating]}) |\n` : ''}
| **Date** | ${new Date().toISOString()} |
| **IP** | ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Anonymous'} |

---

### 💬 Comment
${comment || '*No comment provided*'}

---
*This feedback was automatically submitted from the documentation website.*
  `.trim()

    try {
        // Mai întâi obține repository ID și category ID
        const graphqlQuery = `
            query($owner: String!, $name: String!) {
                repository(owner: $owner, name: $name) {
                    id
                    discussionCategories(first: 10) {
                        nodes {
                            id
                            name
                        }
                    }
                }
            }
        `

        const repoResponse = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: graphqlQuery,
                variables: { owner, name }
            })
        })

        const repoData = await repoResponse.json()

        if (repoData.errors) {
            throw new Error(repoData.errors[0].message)
        }

        const repositoryId = repoData.data.repository.id
        const categories = repoData.data.repository.discussionCategories.nodes
        const feedbackCategory = categories.find(c => c.name === 'Feedbacks') || categories[0]

        if (!feedbackCategory) {
            throw new Error('No discussion category found')
        }

        // Creează discussion-ul
        const createMutation = `
            mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
                createDiscussion(input: {
                    repositoryId: $repositoryId
                    categoryId: $categoryId
                    title: $title
                    body: $body
                }) {
                    discussion {
                        id
                        url
                    }
                }
            }
        `

        const createResponse = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: createMutation,
                variables: {
                    repositoryId: repositoryId,
                    categoryId: feedbackCategory.id,
                    title: title,
                    body: body
                }
            })
        })

        const createData = await createResponse.json()

        if (createData.errors) {
            throw new Error(createData.errors[0].message)
        }

        res.status(200).json({
            success: true,
            discussionUrl: createData.data.createDiscussion.discussion.url,
            title: title
        })

    } catch (error) {
        console.error('Error creating discussion:', error)
        res.status(500).json({
            error: 'Failed to submit feedback',
            details: error.message
        })
    }
}