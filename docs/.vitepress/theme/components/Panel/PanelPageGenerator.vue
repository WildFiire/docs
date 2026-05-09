<template>
    <div class="panel-generator cases-wf" :style="themeStyles">
        <CS2Background :isDark="!isLightTheme" />
        
        <!-- ── Top Navigation Bar ── -->
        <header class="pg-topbar">
            <div class="pg-logo-section">
                <div class="pg-logo-orb-wrap">
                    <LiquidMetalLogo
                        :width="80" 
                        :height="80"                   
                        image="/icons/wildfire.png"
                        colorBack="#00000000"
                        colorTint="#ff7800a6"
                        shape="none"
                        :repetition="2"
                        :softness="0.1"
                        :shiftRed="0.3"
                        :shiftBlue="0.3"
                        :distortion="0.05"
                        :contour="0.4"
                        :angle="70"
                        :speed="0.8"
                        :scale="0.6"
                        fit="contain"
                    />
                </div>
                <div class="pg-logo-text">
                    <span class="pg-brand orbitron-font">PHOENIX</span>
                    <span class="pg-app orbitron-font">Studio</span>
                </div>
            </div>
            
            <div class="pg-actions">
                <div class="pg-theme-palette" title="Switch accent theme">
                    <button v-for="t in themes" :key="t.id"
                            class="theme-swatch"
                            :class="{ active: activeTheme === t.id }"
                            @click="activeTheme = t.id"
                            :title="t.label"
                            :style="{ '--tc': t.color }">
                        <div class="swatch-orb"></div>
                        <span class="swatch-name">{{ t.label }}</span>
                        <Icon v-if="activeTheme === t.id" icon="lucide:check" width="9" class="swatch-check" />
                    </button>
                </div>
                <div class="v-sep"></div>

                <!-- Undo / Redo -->
                <div class="pg-undo-redo-group">
                    <button class="ur-btn" @click="undo" :disabled="historyPointer <= 0" title="Undo (Ctrl+Z)">
                        <Icon icon="lucide:undo-2" width="14" />
                    </button>
                    <span class="ur-count">{{ historyPointer }}/{{ Math.max(0, history.length - 1) }}</span>
                    <button class="ur-btn" @click="redo" :disabled="historyPointer >= history.length - 1" title="Redo (Ctrl+Y)">
                        <Icon icon="lucide:redo-2" width="14" />
                    </button>
                </div>

                <div class="v-sep"></div>
                <button class="pg-action-btn" @click="openExplorer">
                    <Icon icon="lucide:folder-search" width="14"></Icon>
                    <span>BROWSE WIKI</span>
                </button>
                <button class="pg-action-btn" @click="showBackups = !showBackups" :class="{ active: showBackups }">
                    <Icon icon="lucide:history" width="14"></Icon>
                    <span>BACKUPS{{ backups.length ? ` (${backups.length})` : '' }}</span>
                </button>
                <button class="pg-action-btn" @click="copyMD" :class="{ copied }">
                    <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" width="14"></Icon>
                    <span>{{ copied ? 'COPIED' : 'COPY MD' }}</span>
                </button>
                <button class="pg-action-btn" @click="resetCanvas">
                    <Icon icon="lucide:file-plus" width="14"></Icon>
                    <span>NEW PAGE</span>
                </button>
                <button class="pg-action-btn export" @click="downloadMD">
                    <Icon icon="lucide:download" width="14"></Icon>
                    <span>EXPORT</span>
                </button>
            </div>
        </header>

        <!-- ── Main Workspace ── -->
        <div class="pg-main-layout">
            <!-- Left: Configuration Sidebar -->
            <aside class="pg-editor-sidebar">
                <!-- Sidebar Brand Header -->
                <div class="pg-sidebar-brand">
                    <div class="psb-logo">
                        <div class="psb-orb"><Icon icon="solar:cpu-bolt-bold-duotone" width="16" /></div>
                        <div class="psb-label">
                            <span class="psb-title orbitron-font">PHOENIX</span>
                            <span class="psb-sub orbitron-font">STUDIO</span>
                        </div>
                    </div>
                    <button class="psb-add-btn" @click="showAddMenu = !showAddMenu" :class="{ open: showAddMenu }">
                        <Icon :icon="showAddMenu ? 'lucide:x' : 'lucide:plus'" width="14" />
                        <span>{{ showAddMenu ? 'CLOSE' : 'ADD BLOCK' }}</span>
                    </button>
                </div>

                <!-- Block Palette Panel -->
                <transition name="palette-slide">
                <div v-if="showAddMenu" class="palette-panel">
                    <div class="palette-tabs">
                        <button v-for="grp in paletteGroups" :key="grp"
                                class="palette-tab"
                                :class="{ active: activePaletteGroup === grp }"
                                @click="activePaletteGroup = grp">{{ grp }}</button>
                    </div>
                    <div class="palette-grid">
                        <button v-for="t in filteredPaletteBlocks" :key="t.id"
                                class="palette-card"
                                @click="addBlock(t.id); showAddMenu = false">
                            <div class="palette-card-icon" :style="{ background: getBlockColor(t.id) + '18', color: getBlockColor(t.id) }">
                                <Icon :icon="t.icon" width="20" />
                            </div>
                            <span class="palette-card-label">{{ t.label }}</span>
                            <span class="palette-card-group">{{ t.group }}</span>
                        </button>
                    </div>
                </div>
                </transition>
                
                <div class="pg-sidebar-scroll">
                    <!-- Page Header Section -->
                    <div class="pg-config-group">
                        <div class="group-hd" @click="collapsed.header = !collapsed.header">
                            <div class="group-hd-left">
                                <Icon icon="lucide:layout-template" width="14" color="var(--accent)"></Icon>
                                <span>HEADER DATA</span>
                            </div>
                            <Icon :icon="collapsed.header ? 'lucide:chevron-down' : 'lucide:chevron-up'" width="12"></Icon>
                        </div>

                        <!-- Live CaseHeader Mini-Strip -->
                        <div class="pg-live-header-strip" v-if="!collapsed.header || header.title">
                            <div class="lhs-top">
                                <div class="lhs-badge">
                                    <Icon :icon="header.icon || 'lucide:file-text'" width="11" />
                                    <span>{{ header.badge || 'CATEGORY' }}</span>
                                </div>
                                <div class="lhs-tags">
                                    <span v-if="header.tags && header.tags[0]" class="lhs-tag">{{ header.tags[0].text }}</span>
                                </div>
                            </div>
                            <div class="lhs-title">{{ header.title || 'New Wiki Page' }}</div>
                            <div class="lhs-path">
                                <span v-for="(p, i) in (header.path || 'Home').split(',')"
                                      :key="i" class="lhs-crumb">
                                    <span class="lhs-sep" v-if="i > 0">›</span>{{ p.trim() }}
                                </span>
                            </div>
                        </div>

                        <div v-if="!collapsed.header" class="group-content">
                            <div class="studio-field">
                                <label>Display Title</label>
                                <input v-model="header.title" placeholder="Page Title..." />
                            </div>
                            <div class="studio-grid">
                                <div class="studio-field"><label>Category</label><input v-model="header.badge" placeholder="SYSTEMS" /></div>
                                <div class="studio-field">
                                    <label>Icon</label>
                                    <div class="field-with-btn">
                                        <input v-model="header.icon" placeholder="lucide:..." />
                                        <button @click="openIconPicker(null, 'icon')"><Icon icon="lucide:search" width="12"></Icon></button>
                                    </div>
                                </div>
                            </div>
                            <div class="studio-grid">
                                <div class="studio-field"><label>Page ID</label><input v-model="header.pid" placeholder="my-page" /></div>
                                <div class="studio-field"><label>Tag</label><input v-model="header.tags[0].text" placeholder="DRAFT" /></div>
                            </div>
                            <div class="studio-field">
                                <label>Breadcrumb (comma-separated)</label>
                                <input v-model="header.path" placeholder="Home, Section, Page" />
                            </div>
                            <div class="studio-grid">
                                <div class="studio-field"><label>Background Image</label><input v-model="header.background" placeholder="/wallpaper/bg.webp" /></div>
                                <div class="studio-field"><label>Blur Amount</label><input type="number" v-model="header.blurAmount" /></div>
                            </div>
                        </div>
                    </div>


                    <!-- Content Blocks Section -->
                    <div class="pg-config-group">
                        <div class="group-hd" @click="collapsed.blocks = !collapsed.blocks">
                            <div class="group-hd-left">
                                <Icon icon="lucide:layers" width="14" color="var(--accent)"></Icon>
                                <span>CONTENT BLOCKS</span>
                                <span class="blk-count">{{ blocks.length }}</span>
                            </div>
                            <Icon :icon="collapsed.blocks ? 'lucide:chevron-down' : 'lucide:chevron-up'" width="12"></Icon>
                        </div>
                        
                        <div v-if="!collapsed.blocks" class="group-content" style="padding-top:12px">
                            <div class="pg-blocks-stack">
                                <div v-for="(blk, idx) in blocks" :key="blk.id" 
                                     class="studio-block-card" 
                                     :class="{ active: editingBlkId === blk.id }"
                                     :data-id="blk.id">

                                    <!-- Block Header Row -->
                                    <div class="block-hd" @click="toggleEdit(blk.id)">
                                        <div class="block-hd-left">
                                            <div class="block-type-chip" :style="{ background: getBlockColor(blk.type) + '22', borderColor: getBlockColor(blk.type) + '55', color: getBlockColor(blk.type) }">
                                                <Icon :icon="getIcon(blk.type)" width="12"></Icon>
                                            </div>
                                            <div class="block-label-stack">
                                                <span class="blk-type-label">{{ getBlockLabel(blk.type) }}</span>
                                                <span class="blk-preview-text">{{ getBlockPreview(blk) }}</span>
                                            </div>
                                        </div>
                                        <div class="block-controls">
                                            <button class="blk-ctrl-btn" @click.stop="moveBlk(idx, -1)" :disabled="idx === 0" title="Move up">
                                                <Icon icon="lucide:chevron-up" width="11"></Icon>
                                            </button>
                                            <button class="blk-ctrl-btn" @click.stop="moveBlk(idx, 1)" :disabled="idx === blocks.length - 1" title="Move down">
                                                <Icon icon="lucide:chevron-down" width="11"></Icon>
                                            </button>
                                            <button class="blk-ctrl-btn danger" @click.stop="removeBlk(idx)" title="Delete">
                                                <Icon icon="lucide:trash-2" width="11"></Icon>
                                            </button>
                                            <Icon :icon="editingBlkId === blk.id ? 'lucide:chevron-up' : 'lucide:chevron-down'" width="11" class="blk-expand-arrow"></Icon>
                                        </div>
                                    </div>

                                    <!-- Expanded Editor -->
                                    <div v-if="editingBlkId === blk.id" class="block-body">
                                        <template v-if="blk.type === 'section-title'">
                                            <div class="studio-grid">
                                                <div class="studio-field"><label>Number</label><input v-model="blk.num" /></div>
                                                <div class="studio-field">
                                                   <label>Icon</label>
                                                   <div class="field-with-btn">
                                                      <input v-model="blk.icon">
                                                      <button @click="openIconPicker(idx, 'icon')"><Icon icon="lucide:search" width="12"></Icon></button>
                                                   </div>
                                                </div>
                                            </div>
                                            <div class="studio-field"><label>Title</label><input v-model="blk.title" /></div>
                                            <div class="studio-grid">
                                                <div class="studio-field"><label>Color</label><input v-model="blk.color" placeholder="#ffffff" /></div>
                                                <div class="studio-field" style="display:flex; align-items:center; gap:8px; padding-top:25px;">
                                                    <input type="checkbox" v-model="blk.gradient" :id="'grad-'+blk.id" />
                                                    <label :for="'grad-'+blk.id">Use Gradient</label>
                                                </div>
                                            </div>
                                        </template>

                                        <!-- Steps / Icon List -->
                                        <template v-if="blk.type === 'steps'">
                                            <div class="studio-field"><label>List Items (one per line, format: icon|text)</label>
                                                <textarea v-model="blk.body" rows="6" placeholder="lucide:check|Step one..."></textarea>
                                            </div>
                                            <div class="studio-field"><label>Accent Color</label><input v-model="blk.color" placeholder="#ffffff" /></div>
                                        </template>

                                        <!-- Command -->
                                        <template v-if="blk.type === 'command'">
                                            <div class="studio-grid">
                                                <div class="studio-field"><label>Label</label><input v-model="blk.label" placeholder="Meniu Principal" /></div>
                                                <div class="studio-field"><label>Command</label><input v-model="blk.body" placeholder="!missions" /></div>
                                            </div>
                                            <div class="studio-field"><label>Color</label><input v-model="blk.color" placeholder="#ffffff" /></div>
                                        </template>

                                        <template v-if="blk.type === 'h2' || blk.type === 'h3'">
                                            <div class="studio-field"><label>Heading Text</label><input v-model="blk.title" /></div>
                                            <div class="studio-grid">
                                                <div class="studio-field"><label>Anchor ID</label><input v-model="blk.link" placeholder="my-section" /></div>
                                                <div class="studio-field"><label>Color</label><input v-model="blk.color" placeholder="#ffffff" /></div>
                                            </div>
                                        </template>

                                        <template v-if="blk.type === 'paragraph'">
                                            <div class="studio-field"><label>Content (Markdown)</label><textarea v-model="blk.body" rows="5"></textarea></div>
                                        </template>

                                        <!-- Card Type -->
                                        <template v-if="blk.type === 'card'">
                                           <div class="studio-grid">
                                              <div class="studio-field">
                                                 <label>Icon</label>
                                                 <div class="field-with-btn">
                                                    <input v-model="blk.icon">
                                                    <button @click="openIconPicker(idx, 'icon')"><Icon icon="lucide:search" width="12"></Icon></button>
                                                 </div>
                                              </div>
                                              <div class="studio-field"><label>Accent Color</label><input v-model="blk.color" placeholder="#ff7800"></div>
                                           </div>
                                           <div class="studio-grid">
                                              <div class="studio-field"><label>Badge #</label><input v-model="blk.number" placeholder="1.0"></div>
                                              <div class="studio-field"><label>Layout</label><select v-model="blk.layout"><option value="top">Top Media</option><option value="side">Side Media</option></select></div>
                                           </div>
                                           <div class="studio-field"><label>Card Title</label><input v-model="blk.cardTitle" placeholder="Title text"></div>
                                           <div class="studio-field"><label>Media URL</label><input v-model="blk.image" placeholder="/path/to/img.png"></div>
                                           <div class="studio-field" v-if="blk.image"><label>Media Overlay Label</label><input v-model="blk.overlayLabel" placeholder="!missions menu"></div>
                                           <div class="studio-field"><label>Body Content (Markdown)</label><textarea v-model="blk.body" rows="3"></textarea></div>
                                           
                                           <div class="studio-grid">
                                                <div class="studio-field"><label>Border Pos</label><select v-model="blk.borderPos"><option value="left">Left</option><option value="right">Right</option><option value="top">Top</option><option value="bottom">Bottom</option></select></div>
                                                <div class="studio-field" style="display:flex; align-items:center; gap:8px; padding-top:25px;">
                                                    <input type="checkbox" v-model="blk.isGrid" :id="'grid-'+blk.id" />
                                                    <label :for="'grid-'+blk.id">50% Width</label>
                                                </div>
                                           </div>

                                           <div class="studio-field"><label>Primary Link (Full Card)</label><input v-model="blk.link" placeholder="https://..."></div>
                                           
                                           <div class="studio-field">
                                              <label>Extra Links (JSON: {text, href})</label>
                                              <div v-for="(lnk, li) in blk.links" :key="li" class="studio-grid" style="margin-bottom:8px">
                                                 <input v-model="lnk.text" placeholder="Text">
                                                 <input v-model="lnk.href" placeholder="URL">
                                                 <button @click="blk.links.splice(li, 1)" style="grid-column: span 2; background:rgba(239,68,68,0.1); color:#ef4444; border:none; padding:4px; border-radius:4px; font-size:9px; font-weight:900; cursor:pointer;">REMOVE LINK</button>
                                              </div>
                                              <button @click="blk.links.push({text: 'New Link', href: '#'})" class="sidebar-add-btn" style="width:100%; margin:0;">+ ADD LINK</button>
                                           </div>
                                        </template>

                                        <!-- Feature Grid Type -->
                                        <template v-if="blk.type === 'feature-grid'">
                                           <div class="studio-field"><label>Grid Title</label><input v-model="blk.title"></div>
                                           <div class="studio-field"><label>Items (icon|text per line)</label><textarea v-model="blk.items" rows="4" placeholder="lucide:check|Fast\nlucide:zap|Powerful"></textarea></div>
                                        </template>

                                        <!-- Timeline Type -->
                                        <template v-if="blk.type === 'timeline'">
                                            <div class="studio-field"><label>Steps (date|description per line)</label><textarea v-model="blk.body" rows="4" placeholder="2024|Started\n2025|Launched"></textarea></div>
                                        </template>

                                        <!-- Image Gallery Type -->
                                        <template v-if="blk.type === 'image-gallery'">
                                            <div class="studio-field"><label>Images (one URL per line)</label><textarea v-model="blk.images" rows="4" placeholder="/path/to/img1.png\n/path/to/img2.png"></textarea></div>
                                        </template>

                                        <!-- Video Embed Type -->
                                        <template v-if="blk.type === 'video'">
                                           <div class="studio-grid">
                                              <div class="studio-field"><label>Platform</label><select v-model="blk.platform"><option value="youtube">YouTube</option></select></div>
                                              <div class="studio-field"><label>Video ID</label><input v-model="blk.vid" placeholder="dQw4w9WgXcQ"></div>
                                           </div>
                                           <div class="studio-field"><label>Title</label><input v-model="blk.title"></div>
                                        </template>

                                        <!-- File Download Type -->
                                        <template v-if="blk.type === 'file'">
                                           <div class="studio-field"><label>Button Label</label><input v-model="blk.label"></div>
                                           <div class="studio-grid">
                                              <div class="studio-field"><label>File URL</label><input v-model="blk.url"></div>
                                              <div class="studio-field"><label>File Size</label><input v-model="blk.size" placeholder="1.2 MB"></div>
                                           </div>
                                        </template>

                                        <!-- KV Grid Type -->
                                        <template v-if="blk.type === 'stat-grid'">
                                           <div class="studio-field"><label>Stats (Key|Value per line)</label><textarea v-model="blk.body" rows="4" placeholder="Health|100\nArmor|50"></textarea></div>
                                        </template>

                                        <!-- Progress Bar Type -->
                                        <template v-if="blk.type === 'progress'">
                                           <div class="studio-field"><label>Label</label><input v-model="blk.label"></div>
                                           <div class="studio-grid">
                                              <div class="studio-field"><label>Current Value</label><input type="number" v-model="blk.value"></div>
                                              <div class="studio-field"><label>Max Value</label><input type="number" v-model="blk.max"></div>
                                           </div>
                                           <div class="studio-field"><label>Custom Color</label><input type="color" v-model="blk.color"></div>
                                        </template>

                                        <!-- Lore Quote Type -->
                                        <template v-if="blk.type === 'quote'">
                                           <div class="studio-field"><label>Quote Body</label><textarea v-model="blk.body" rows="3"></textarea></div>
                                           <div class="studio-field"><label>Author / Source</label><input v-model="blk.author"></div>
                                        </template>

                                        <template v-if="blk.type === 'numbered-steps'">
                                            <div class="studio-field"><label>Steps (Title|Description per line)</label>
                                                <textarea v-model="blk.body" rows="6" placeholder="Step 1|Doing something..."></textarea>
                                            </div>
                                        </template>

                                        <template v-if="blk.type === 'lore-header'">
                                            <div class="studio-field"><label>Big Title</label><input v-model="blk.title" /></div>
                                            <div class="studio-field"><label>Small Subtitle</label><input v-model="blk.sub" /></div>
                                        </template>

                                        <template v-if="blk.type === 'grid-start'">
                                            <div class="studio-field"><label>Columns</label><input type="number" v-model="blk.cols" min="1" max="4" /></div>
                                        </template>

                                        <template v-if="blk.type === 'grid-end' || blk.type === 'divider'">
                                            <div style="padding: 10px; font-size: 11px; opacity: 0.5; text-align: center;">NO EXTRA CONFIG NEEDED</div>
                                        </template>

                                        <template v-if="blk.type === 'media-showcase'">
                                            <div class="studio-field"><label>Image URL</label><input v-model="blk.image" /></div>
                                            <div class="studio-field"><label>Label (Floating)</label><input v-model="blk.label" /></div>
                                            <div class="studio-field"><label>Caption (Bottom)</label><textarea v-model="blk.caption" rows="2"></textarea></div>
                                        </template>

                                        <template v-if="blk.type === 'key-row'">
                                            <div class="studio-field"><label>Keys (Key|Action per line)</label>
                                                <textarea v-model="blk.body" rows="4" placeholder="E|Interact"></textarea>
                                            </div>
                                        </template>

                                        <!-- Comparison Type -->
                                        <template v-if="blk.type === 'compare'">
                                           <div class="studio-grid">
                                              <div class="studio-field">
                                                 <label>Left Title</label><input v-model="blk.leftTitle">
                                              </div>
                                              <div class="studio-field">
                                                 <label>Right Title</label><input v-model="blk.rightTitle">
                                              </div>
                                           </div>
                                           <div class="studio-grid">
                                              <div class="studio-field">
                                                 <label>Left Icon</label>
                                                 <div class="field-with-btn">
                                                    <input v-model="blk.leftIcon">
                                                    <button @click="openIconPicker(idx, 'leftIcon')"><Icon icon="lucide:search" width="12"></Icon></button>
                                                 </div>
                                              </div>
                                              <div class="studio-field">
                                                 <label>Right Icon</label>
                                                 <div class="field-with-btn">
                                                    <input v-model="blk.rightIcon">
                                                    <button @click="openIconPicker(idx, 'rightIcon')"><Icon icon="lucide:search" width="12"></Icon></button>
                                                 </div>
                                              </div>
                                           </div>
                                           <div class="studio-field"><label>Rows (Label|LeftVal|RightVal per line)</label><textarea v-model="blk.body" rows="5" placeholder="Power|10|25\nDefense|5|12"></textarea></div>
                                        </template>

                                        <!-- Hero Type -->
                                        <template v-if="blk.type === 'hero'">
                                           <div class="studio-field"><label>Hero Title</label><input v-model="blk.title"></div>
                                           <div class="studio-field"><label>Subtitle</label><input v-model="blk.subtitle"></div>
                                           <div class="studio-grid">
                                              <div class="studio-field"><label>Badge</label><input v-model="blk.badge"></div>
                                              <div class="studio-field"><label>Background URL</label><input v-model="blk.image"></div>
                                           </div>
                                        </template>

                                        <!-- Skill Type -->
                                        <template v-if="blk.type === 'skill'">
                                           <div class="studio-grid">
                                              <div class="studio-field"><label>Skill Name</label><input v-model="blk.name"></div>
                                              <div class="studio-field">
                                                 <label>Icon</label>
                                                 <div class="field-with-btn">
                                                    <input v-model="blk.icon">
                                                    <button @click="openIconPicker(idx, 'icon')"><Icon icon="lucide:search" width="12"></Icon></button>
                                                 </div>
                                              </div>
                                           </div>
                                           <div class="studio-grid">
                                              <div class="studio-field"><label>Type Label</label><input v-model="blk.type_label"></div>
                                              <div class="studio-field"><label>Cost</label><input v-model="blk.cost"></div>
                                              <div class="studio-field"><label>CD</label><input v-model="blk.cd"></div>
                                           </div>
                                           <div class="studio-field"><label>Stats (Key|Value per line)</label><textarea v-model="blk.stats" rows="3" placeholder="Health|100\nArmor|50"></textarea></div>
                                           <div class="studio-field"><label>Description</label><textarea v-model="blk.desc" rows="3"></textarea></div>
                                        </template>

                                        <!-- Alert Type -->
                                        <template v-if="blk.type === 'alert'">
                                           <div class="studio-grid">
                                              <div class="studio-field"><label>Variant</label><select v-model="blk.variant"><option value="info">Info</option><option value="warning">Warning</option><option value="success">Success</option><option value="error">Error</option></select></div>
                                              <div class="studio-field">
                                                 <label>Icon</label>
                                                 <div class="field-with-btn">
                                                    <input v-model="blk.icon">
                                                    <button @click="openIconPicker(idx, 'icon')"><Icon icon="lucide:search" width="12"></Icon></button>
                                                 </div>
                                              </div>
                                           </div>
                                           <div class="studio-field"><label>Title</label><input v-model="blk.title"></div>
                                           <div class="studio-field"><label>Body</label><textarea v-model="blk.body" rows="3"></textarea></div>
                                        </template>

                                        <!-- Link Grid Type -->
                                        <template v-if="blk.type === 'link-grid'">
                                           <div class="studio-field"><label>Links (Label|URL|Icon per line)</label><textarea v-model="blk.links" rows="5" placeholder="Docs|/docs|lucide:book\nAPI|/api|lucide:code"></textarea></div>
                                        </template>

                                        <template v-if="blk.type === 'collapse'">
                                            <div class="studio-grid">
                                                <div class="studio-field">
                                                   <label>Icon</label>
                                                   <div class="field-with-btn">
                                                      <input v-model="blk.icon">
                                                      <button @click="openIconPicker(idx, 'icon')"><Icon icon="lucide:search" width="12"></Icon></button>
                                                   </div>
                                                </div>
                                                <div class="studio-field"><label>Header</label><input v-model="blk.title" /></div>
                                            </div>
                                            <div class="studio-field"><label>Body</label><textarea v-model="blk.body" rows="4"></textarea></div>
                                        </template>

                                        <template v-if="blk.type === 'badge'">
                                            <div class="studio-grid">
                                                <div class="studio-field"><label>Text</label><input v-model="blk.text" /></div>
                                                <div class="studio-field">
                                                    <label>Style</label>
                                                    <select v-model="blk.variant">
                                                        <option value="normal">Default</option>
                                                        <option value="punish">Punish (Red)</option>
                                                        <option value="step">Step (Gradient)</option>
                                                        <option value="highlight">Highlight</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </template>

                                        <template v-if="blk.type === 'tip'">
                                            <div class="studio-grid">
                                                <div class="studio-field">
                                                   <label>Icon</label>
                                                   <div class="field-with-btn">
                                                      <input v-model="blk.icon">
                                                      <button @click="openIconPicker(idx, 'icon')"><Icon icon="lucide:search" width="12"></Icon></button>
                                                   </div>
                                                </div>
                                                <div class="studio-field">
                                                    <label>Variant</label>
                                                    <select v-model="blk.qtype">
                                                        <option value="green">Success (Green)</option>
                                                        <option value="orange">Warning (Orange)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="studio-field"><label>Content</label><textarea v-model="blk.body" rows="3"></textarea></div>
                                        </template>

                                        <template v-if="blk.type === 'key-row'">
                                            <div class="studio-field"><label>Keys (Format: KEY|Description)</label><textarea v-model="blk.body" rows="3" placeholder="E|Select Item\nF|Go Up"></textarea></div>
                                        </template>

                                        <template v-if="blk.type === 'media-showcase'">
                                            <div class="studio-field"><label>Image Path</label><input v-model="blk.image" /></div>
                                            <div class="studio-grid">
                                                <div class="studio-field"><label>Overlay Badge</label><input v-model="blk.label" /></div>
                                                <div class="studio-field"><label>Bottom Caption</label><input v-model="blk.caption" /></div>
                                            </div>
                                        </template>

                                        <template v-if="blk.type === 'image'">
                                            <div class="studio-field"><label>Image URL / Path</label><input v-model="blk.src" placeholder="/images/photo.png" /></div>
                                            <div class="studio-grid">
                                                <div class="studio-field"><label>Alt Text</label><input v-model="blk.alt" /></div>
                                                <div class="studio-field"><label>Caption</label><input v-model="blk.caption" /></div>
                                            </div>
                                        </template>

                                        <template v-if="blk.type === 'link'">
                                            <div class="studio-field"><label>Link Text</label><input v-model="blk.text" /></div>
                                            <div class="studio-field"><label>URL</label><input v-model="blk.href" placeholder="https://..." /></div>
                                            <div class="studio-field-row">
                                                <label class="studio-switch"><input type="checkbox" v-model="blk.external" /><span class="switch-slider"></span></label>
                                                <span class="switch-label">Open in new tab</span>
                                            </div>
                                        </template>

                                        <template v-if="blk.type === 'code'">
                                            <div class="studio-field"><label>Language</label><input v-model="blk.lang" placeholder="javascript, bash, vue..." /></div>
                                            <div class="studio-field"><label>Code</label><textarea v-model="blk.code" rows="6" style="font-family:monospace;font-size:12px"></textarea></div>
                                        </template>

                                        <template v-if="blk.type === 'table'">
                                            <div class="studio-field"><label>Headers (comma-separated)</label><input v-model="blk.headers" placeholder="Col 1, Col 2, Col 3" /></div>
                                            <div class="studio-field"><label>Rows (one per line, comma values)</label><textarea v-model="blk.rows" rows="5" placeholder="Val 1, Val 2, Val 3"></textarea></div>
                                        </template>

                                        <template v-if="blk.type === 'stat'">
                                            <div class="studio-grid">
                                                <div class="studio-field"><label>Value</label><input v-model="blk.value" /></div>
                                                <div class="studio-field"><label>Label</label><input v-model="blk.label" /></div>
                                            </div>
                                            <div class="studio-field" style="display:flex; align-items:center; gap:8px; padding-bottom:10px;">
                                                <input type="checkbox" v-model="blk.isGrid" :id="'grid-stat-'+blk.id" />
                                                <label :for="'grid-stat-'+blk.id">50% Width Grid</label>
                                            </div>
                                        </template>

                                        <template v-if="blk.type === 'divider'">
                                            <div class="studio-field" style="text-align:center; padding:10px; opacity:0.5; font-size:10px;">
                                                <span>HORIZONTAL DIVIDER LINE</span>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
            
            <!-- ── Center/Right: Preview Area ── -->
            <main class="pg-preview-container">
                <nav class="preview-tabs">
                    <div class="tabs-list">
                        <button :class="{ active: viewMode === 'visual' }" @click="viewMode = 'visual'">
                            <Icon icon="lucide:monitor" width="14"></Icon>
                            <span>CANVAS</span>
                        </button>
                        <button :class="{ active: viewMode === 'code' }" @click="viewMode = 'code'">
                            <Icon icon="lucide:code-2" width="14"></Icon>
                            <span>MARKDOWN</span>
                        </button>
                    </div>
                    <div class="live-indicator">
                        <div class="live-dot"></div>
                        <span>LIVE PREVIEW</span>
                    </div>
                </nav>

                <div class="preview-viewport" :data-wf-theme="themes.find(t => t.id === activeTheme)?.wf" :style="themeStyles">
                    <div v-if="viewMode === 'visual'" class="canvas-render">
                        <div class="canvas-content">
                            <!-- CaseHeader Preview -->
                            <div class="canvas-header-preview">
                                <div class="wch-root cases-wf">
                                    <div class="wch-grid-bg" aria-hidden="true" />
                                    <div class="wch-ambient-glow" aria-hidden="true" />
                                    <div class="wch-inner">
                                        <nav class="wch-breadcrumb">
                                            <template v-for="(p, i) in headerPathArray" :key="i">
                                                <span :class="['wch-crumb', { 'wch-crumb--active': i === headerPathArray.length - 1 }]">{{ p }}</span>
                                                <Icon v-if="i < headerPathArray.length - 1" icon="lucide:chevron-right" width="10" class="wch-crumb-arrow"></Icon>
                                            </template>
                                        </nav>
                                        
                                        <h1 class="wch-title">{{ header.title }}</h1>
                                        
                                        <div class="wch-tags">
                                            <component v-for="(t, i) in header.tags" :is="t.component" :key="i">{{ t.text }}</component>
                                        </div>

                                        <div class="wch-toolbar">
                                            <div class="wch-btn">
                                                <Icon icon="lucide:edit-3" width="13"></Icon>
                                                Edit this page
                                            </div>
                                            <div class="wch-btn">
                                                <Icon icon="lucide:copy" width="13"></Icon>
                                                Copy markdown
                                            </div>
                                        </div>

                                        <div class="wch-meta">
                                            <span class="wch-meta-chip">
                                                <Icon icon="lucide:clock" width="11"></Icon>
                                                Updated Today
                                            </span>
                                            <div class="wch-meta-chip">
                                                <div class="wch-author-pfp" style="width:20px;height:20px;background:var(--accent);border-radius:50%"></div>
                                                by Wildfire Studio
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="canvas-blocks">
                                <template v-for="blk in processedBlocks" :key="blk.id">
                                    
                                    <!-- Grid Container -->
                                    <div v-if="blk.type === 'grid-container'" class="wf-info-grid canvas-grid-wrapper" 
                                         :style="{ gridTemplateColumns: `repeat(${blk.config.cols || 2}, 1fr)` }"
                                         :class="{ 'is-editing': editingBlkId === blk.id }"
                                         @click="toggleEdit(blk.id)">
                                        
                                        <div v-for="subBlk in blk.blocks" :key="subBlk.id" class="canvas-blk-wrap"
                                             :class="{ 'is-editing': editingBlkId === subBlk.id }"
                                             @click.stop="toggleEdit(subBlk.id)">
                                                                   <!-- All blocks supported inside grid -->
                                             <div v-if="subBlk.type === 'card'" class="wf-info-card" :class="{ 'side-layout': subBlk.layout === 'side' }" :style="subBlk.color ? { borderLeftColor: subBlk.color } : {}">
                                                 <div v-if="subBlk.image" class="wf-info-card-media" style="position:relative">
                                                     <img :src="subBlk.image" :style="subBlk.layout === 'side' ? { width:'100%', height:'100%', objectFit:'cover' } : { width:'100%', height:'180px', objectFit:'cover' }" />
                                                     <div v-if="subBlk.overlayLabel" class="card-overlay-badge" :style="{ color: subBlk.color || 'var(--vp-c-brand-1)' }">{{ subBlk.overlayLabel }}</div>
                                                 </div>
                                                 <div class="wf-info-icon" :style="subBlk.color ? { background: subBlk.color } : {}"><Icon :icon="subBlk.icon"></Icon></div>
                                                 <div class="wf-info-content">
                                                     <div v-if="subBlk.number" class="wf-info-number" :style="subBlk.color ? { color: subBlk.color } : {}">{{ subBlk.number }}</div>
                                                     <div v-if="subBlk.cardTitle" class="card-title" :style="subBlk.color ? { color: subBlk.color } : {}">{{ subBlk.cardTitle }}</div>
                                                     <div v-html="renderInline(subBlk.body)"></div>
                                                 </div>
                                             </div>
                                             <div v-else-if="subBlk.type === 'stat'" class="wf-info-stat-item">
                                                 <div class="wf-info-stat-number" :style="{ color: subBlk.color || 'var(--vp-c-brand-1)' }">{{ subBlk.value }}</div>
                                                 <div class="wf-info-stat-label">{{ subBlk.label }}</div>
                                             </div>
                                             <div v-else-if="subBlk.type === 'badge'" style="margin-bottom:10px">
                                                 <span :class="'wf-info-' + (subBlk.variant === 'normal' ? 'badge' : subBlk.variant)">{{ subBlk.text }}</span>
                                             </div>
                                             <div v-else-if="subBlk.type === 'paragraph'" v-html="renderInline(subBlk.body)"></div>
                                             <div v-else-if="subBlk.type === 'image'">
                                                 <img :src="subBlk.src" style="width:100%; border-radius:8px; margin-bottom:8px" />
                                                 <div v-if="subBlk.caption" style="font-size:11px; opacity:0.6; text-align:center">{{ subBlk.caption }}</div>
                                             </div>
                                             <div v-else-if="subBlk.type === 'link'">
                                                 <div class="wf-btn primary mini-btn"><Icon icon="lucide:external-link" width="12"></Icon> {{ subBlk.text }}</div>
                                             </div>
                                             <div v-else-if="subBlk.type === 'tip'" class="wf-system-tip mini-tip" :class="subBlk.variant || 'orange'">
                                                 <Icon :icon="subBlk.icon || 'lucide:lightbulb'" width="14"></Icon>
                                                 <span>{{ subBlk.body }}</span>
                                             </div>
                                             <div v-else-if="subBlk.type === 'stat-grid'" class="wf-stat-grid mini-grid">
                                                 <div v-for="(item, ki) in (subBlk.body || '').split('\n').filter(s => s.includes('|'))" :key="ki" class="kv-item">
                                                     <span class="kv-key">{{ item.split('|')[0].trim() }}</span>
                                                     <span class="kv-val">{{ item.split('|')[1].trim() }}</span>
                                                 </div>
                                             </div>
                                             <div v-else-if="subBlk.type === 'progress'" class="wf-progress-wrap mini-progress">
                                                 <div v-if="subBlk.label" class="progress-label"><span>{{ subBlk.label }}</span><span>{{ Math.round(subBlk.value/subBlk.max*100) }}%</span></div>
                                                 <div class="progress-track"><div class="progress-bar" :style="{ width: (subBlk.value/subBlk.max*100) + '%', background: subBlk.color || 'var(--vp-c-brand-1)' }"></div></div>
                                             </div>
                                             <div v-else-if="subBlk.type === 'collapse'" class="wf-collapse-preview">
                                                 <div class="wf-collapse-hd"><Icon :icon="subBlk.icon || 'lucide:chevron-down'"></Icon> {{ subBlk.title }}</div>
                                             </div>
                                             <div v-else-if="subBlk.type === 'code'" class="wf-code-preview"><code>{{ subBlk.code }}</code></div>
                                             <div v-else-if="subBlk.type === 'table'" class="wf-table-preview"><table><thead><tr><th v-for="h in subBlk.headers.split(',')" :key="h">{{h}}</th></tr></thead></table></div>
                                             <div v-else-if="subBlk.type === 'image-gallery'" class="wf-image-gallery"><div class="gallery-grid"><img v-for="img in subBlk.images.split('\n')" :src="img" /></div></div>
                                             <div v-else-if="subBlk.type === 'video'" class="wf-video-preview">Video: {{ subBlk.src }}</div>
                                             <div v-else-if="subBlk.type === 'file'" class="wf-file-preview">File: {{ subBlk.name }}</div>
                                             <div v-else-if="subBlk.type === 'quote'" class="wf-quote-preview">"{{ subBlk.body }}"</div>
                                             <div v-else-if="subBlk.type === 'compare'" class="wf-compare-preview">Compare: {{ subBlk.leftTitle }} vs {{ subBlk.rightTitle }}</div>
                                             <div v-else-if="subBlk.type === 'key-row'" class="wf-key-preview"><kbd>{{ subBlk.body.split('|')[0] }}</kbd></div>
                                             <div v-else-if="subBlk.type === 'feature-grid'" class="wf-feature-grid mini">
                                                 <div class="feature-header">{{ subBlk.title }}</div>
                                                 <div class="feature-items">
                                                     <div v-for="(item, fi) in (subBlk.items || '').split('\n').filter(s => s.includes('|'))" :key="fi" class="feature-item">
                                                         <Icon :icon="item.split('|')[0].trim()"></Icon>
                                                         <span>{{ item.split('|')[1].trim() }}</span>
                                                     </div>
                                                 </div>
                                             </div>
                                             <div v-else-if="subBlk.type === 'timeline'" class="wf-timeline mini">
                                                 <div v-for="(point, ti) in (subBlk.body || '').split('\n').filter(s => s.includes('|'))" :key="ti" class="timeline-point">
                                                     <div class="point-marker"></div>
                                                     <div class="point-content"><strong>{{ point.split('|')[0].trim() }}</strong><span>{{ point.split('|')[1].trim() }}</span></div>
                                                 </div>
                                             </div>
                                             <div v-else class="preview-mini-placeholder">{{ subBlk.type.toUpperCase() }} BLOCK</div>

                                            <div class="blk-overlay" v-if="editingBlkId === subBlk.id">
                                                <Icon icon="lucide:mouse-pointer-2" width="10"></Icon>
                                                <span>EDITING</span>
                                            </div>
                                        </div>

                                        <div class="grid-marker-end">
                                            <Icon icon="lucide:layout-grid" width="12"></Icon>
                                            <span>GRID CONTAINER END</span>
                                        </div>
                                    </div>

                                    <!-- Normal Blocks -->
                                    <div v-else class="canvas-blk-wrap" 
                                         :class="{ 'grid-item': blk.isGrid, 'is-editing': editingBlkId === blk.id }"
                                         :data-id="blk.id"
                                         @click="toggleEdit(blk.id)">
                                        
                                        <!-- Section Title -->
                                        <div v-if="blk.type === 'section-title'" class="wf-info-title" :class="{ 'wf-system-title-hover': blk.gradient }" :style="blk.color && !blk.gradient ? { color: blk.color } : {}">
                                            <Icon :icon="blk.icon" :style="blk.color && !blk.gradient ? { color: blk.color } : {}"></Icon>
                                            <div v-if="blk.num" class="wf-info-number" :style="blk.color ? { background: blk.color, color: '#fff' } : {}">{{ blk.num }}</div>
                                            <span :style="blk.gradient ? { background: `linear-gradient(135deg, ${blk.color || 'var(--vp-c-brand-1)'}, var(--vp-c-brand-3))`, webkitBackgroundClip: 'text', backgroundClip: 'text', webkitTextFillColor: 'transparent' } : {}">{{ blk.title }}</span>
                                        </div>

                                        <!-- Lore Header -->
                                        <div v-else-if="blk.type === 'lore-header'" class="canvas-lore-header">
                                            <div class="lore-sub">{{ blk.sub }}</div>
                                            <h2 class="lore-title">{{ blk.title }}</h2>
                                            <div class="lore-divider" :style="{ background: blk.color || 'var(--vp-c-brand-1)' }"></div>
                                        </div>

                                        <!-- Numbered Steps -->
                                        <div v-else-if="blk.type === 'numbered-steps'" class="wf-numbered-steps">
                                            <div v-for="(step, si) in (blk.body || '').split('\n').filter(s => s.trim())" :key="si" class="wf-step-item">
                                                <div class="step-num" :style="{ color: blk.color || 'var(--vp-c-brand-1)' }">{{ si + 1 }}</div>
                                                <div class="step-text" v-html="renderInline(step)"></div>
                                            </div>
                                        </div>

                                        <!-- Hero Section -->
                                        <div v-else-if="blk.type === 'hero'" class="wf-hero-section" :style="{ backgroundImage: `url(${blk.image})` }">
                                            <div class="hero-overlay"></div>
                                            <div class="hero-content">
                                                <div class="hero-badge" :style="{ color: blk.color || 'var(--vp-c-brand-1)' }">{{ blk.badge }}</div>
                                                <h1>{{ blk.title }}</h1>
                                                <p>{{ blk.subtitle }}</p>
                                            </div>
                                        </div>

                                        <!-- Skill Card -->
                                        <div v-else-if="blk.type === 'skill'" class="wf-skill-card">
                                            <div class="skill-header">
                                                <Icon :icon="blk.icon" class="skill-icon" :style="{ color: blk.color || 'var(--vp-c-brand-1)' }"></Icon>
                                                <div class="skill-meta">
                                                    <div class="skill-name">{{ blk.name }}</div>
                                                    <div class="skill-type">{{ blk.type_label }}</div>
                                                </div>
                                            </div>
                                            <div class="skill-stats">
                                                <div v-if="blk.cost" class="skill-stat"><span>Cost</span><span>{{ blk.cost }}</span></div>
                                                <div v-if="blk.cd" class="skill-stat"><span>CD</span><span>{{ blk.cd }}s</span></div>
                                                <div v-for="(stat, sti) in (blk.stats || '').split('\n').filter(s => s.includes('|'))" :key="sti" class="skill-stat">
                                                    <span>{{ stat.split('|')[0].trim() }}</span>
                                                    <span>{{ stat.split('|')[1].trim() }}</span>
                                                </div>
                                            </div>
                                            <p class="skill-desc">{{ blk.desc }}</p>
                                        </div>

                                        <!-- Status Alert -->
                                        <div v-else-if="blk.type === 'alert'" class="wf-status-alert" :class="blk.variant || 'info'">
                                            <Icon :icon="blk.variant === 'error' ? 'lucide:alert-octagon' : blk.variant === 'warning' ? 'lucide:alert-triangle' : 'lucide:info'"></Icon>
                                            <div class="alert-body">
                                                <div class="alert-title">{{ blk.title }}</div>
                                                <p>{{ blk.body }}</p>
                                            </div>
                                        </div>

                                        <!-- Link Grid -->
                                        <div v-else-if="blk.type === 'link-grid'" class="wf-link-hub">
                                            <div v-for="(link, li) in (blk.links || '').split('\n').filter(s => s.includes('|'))" :key="li" class="link-item">
                                                <Icon :icon="link.split('|')[0].trim()"></Icon>
                                                <span>{{ link.split('|')[1].trim() }}</span>
                                            </div>
                                        </div>

                                        <!-- Card -->
                                        <div v-else-if="blk.type === 'card'" class="wf-info-card" :class="{ 'side-layout': blk.layout === 'side' }" :style="blk.color ? { borderLeftColor: blk.color } : {}">
                                             <div v-if="blk.image" class="wf-info-card-media" style="position:relative">
                                                 <img :src="blk.image" :style="blk.layout === 'side' ? { width:'100%', height:'100%', objectFit:'cover' } : { width:'100%', height:'180px', objectFit:'cover' }" />
                                                 <div v-if="blk.overlayLabel" class="card-overlay-badge" :style="{ color: blk.color || 'var(--vp-c-brand-1)' }">{{ blk.overlayLabel }}</div>
                                             </div>
                                             <div class="wf-info-icon" :style="blk.color ? { background: blk.color } : {}"><Icon :icon="blk.icon"></Icon></div>
                                             <div class="wf-info-content">
                                                 <div v-if="blk.number" class="wf-info-number" :style="blk.color ? { color: blk.color } : {}">{{ blk.number }}</div>
                                                 <div v-if="blk.cardTitle" class="card-title" :style="blk.color ? { color: blk.color } : {}">{{ blk.cardTitle }}</div>
                                                 <div v-html="renderInline(blk.body)"></div>
                                             </div>
                                         </div>

                                        <div v-else-if="blk.type === 'paragraph'" class="canvas-paragraph" v-html="renderInline(blk.body)"></div>
                                        <h2 v-else-if="blk.type === 'h2'" class="canvas-h2">{{ blk.title }}</h2>
                                        <h3 v-else-if="blk.type === 'h3'" class="canvas-h3">{{ blk.title }}</h3>

                                        <!-- Command Preview -->
                                        <div v-else-if="blk.type === 'command'" class="canvas-command-preview">
                                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                                <span style="font-size: 11px; color: var(--studio-muted); font-weight: 700; text-transform: uppercase;">{{ blk.label }}</span>
                                                <code :style="blk.color ? { background: blk.color + '11', color: blk.color, borderColor: blk.color + '33' } : {}" 
                                                      style="border: 1px solid rgba(255,255,255,0.1); padding: 6px 14px; border-radius: 8px; font-weight: 800; width: fit-content; font-family: 'JetBrains Mono', monospace;">
                                                    {{ blk.body }}
                                                </code>
                                            </div>
                                        </div>

                                        <!-- Media Showcase Preview -->
                                        <div v-else-if="blk.type === 'media-showcase'" class="media-showcase-canvas">
                                            <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px;">
                                                <div style="position: relative; border-radius: 12px; overflow: hidden;">
                                                    <img :src="blk.image" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px;" />
                                                    <div v-if="blk.label" style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: var(--accent);">{{ blk.label }}</div>
                                                </div>
                                                <div v-if="blk.caption" style="text-align: center; padding: 12px; font-size: 12px; color: var(--studio-muted);">{{ blk.caption }}</div>
                                            </div>
                                        </div>

                                        <!-- Stat Grid Preview -->
                                        <div v-else-if="blk.type === 'stat-grid'" class="wf-stat-grid" style="margin-bottom:30px;">
                                            <div v-for="(item, ki) in (blk.body || '').split('\n').filter(s => s.includes('|'))" :key="ki" class="kv-item">
                                                <span class="kv-key">{{ item.split('|')[0].trim() }}</span>
                                                <span class="kv-val">{{ item.split('|')[1].trim() }}</span>
                                            </div>
                                        </div>

                                        <!-- Other types -->
                                        <div v-else-if="blk.type === 'steps'" class="canvas-steps-preview">
                                            <ul class="wf-system-custom-list">
                                                <li v-for="(item, si) in (blk.body || '').split('\n').filter(s => s.includes('|'))" :key="si">
                                                    <Icon :icon="item.split('|')[0].trim()" :style="blk.color ? { color: blk.color } : {}"></Icon>
                                                    <span>{{ item.split('|')[1].trim() }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div v-else-if="blk.type === 'badge'" style="margin-bottom:15px">
                                            <span :class="'wf-info-' + (blk.variant === 'normal' ? 'badge' : blk.variant)">{{ blk.text }}</span>
                                        </div>
                                        <div v-else-if="blk.type === 'tip'" class="wf-system-tip" :class="blk.variant || 'orange'">
                                            <Icon :icon="blk.icon || 'lucide:lightbulb'"></Icon>
                                            <span>{{ blk.body }}</span>
                                        </div>

                                        <!-- New Atmospheric & Data Blocks -->
                                        <div v-else-if="blk.type === 'quote'" class="wf-lore-quote">
                                            <Icon icon="lucide:quote" class="quote-icon"></Icon>
                                            <p>{{ blk.body }}</p>
                                            <cite v-if="blk.author">— {{ blk.author }}</cite>
                                        </div>

                                        <div v-else-if="blk.type === 'compare'" class="wf-compare-grid">
                                            <div class="compare-col left">
                                                <div class="col-hd"><Icon :icon="blk.leftIcon || 'lucide:shield'"></Icon> {{ blk.leftTitle }}</div>
                                                <div v-for="(row, ri) in (blk.body || '').split('\n').filter(s => s.includes('|'))" :key="ri" class="compare-row">
                                                    <span class="row-label">{{ row.split('|')[0] }}</span>
                                                    <span class="row-val">{{ row.split('|')[1] }}</span>
                                                </div>
                                            </div>
                                            <div class="compare-col right">
                                                <div class="col-hd"><Icon :icon="blk.rightIcon || 'lucide:zap'"></Icon> {{ blk.rightTitle }}</div>
                                                <div v-for="(row, ri) in (blk.body || '').split('\n').filter(s => s.includes('|'))" :key="ri" class="compare-row">
                                                    <span class="row-label">{{ row.split('|')[0] }}</span>
                                                    <span class="row-val highlight">{{ row.split('|')[2] }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else-if="blk.type === 'key-row'" class="wf-key-grid">
                                            <div v-for="(key, ki) in (blk.body || '').split('\n').filter(s => s.includes('|'))" :key="ki" class="key-item">
                                                <kbd>{{ key.split('|')[0].trim() }}</kbd>
                                                <span>{{ key.split('|')[1].trim() }}</span>
                                            </div>
                                        </div>

                                        <div v-else-if="blk.type === 'feature-grid'" class="wf-feature-grid">
                                             <div class="feature-header">{{ blk.title }}</div>
                                             <div class="feature-items">
                                                 <div v-for="(item, fi) in (blk.items || '').split('\n').filter(s => s.includes('|'))" :key="fi" class="feature-item">
                                                     <Icon :icon="item.split('|')[0].trim()"></Icon>
                                                     <span>{{ item.split('|')[1].trim() }}</span>
                                                 </div>
                                             </div>
                                         </div>

                                         <div v-else-if="blk.type === 'timeline'" class="wf-timeline">
                                             <div v-for="(point, ti) in (blk.body || '').split('\n').filter(s => s.includes('|'))" :key="ti" class="timeline-point">
                                                 <div class="point-marker"></div>
                                                 <div class="point-content">
                                                     <strong>{{ point.split('|')[0].trim() }}</strong>
                                                     <span>{{ point.split('|')[1].trim() }}</span>
                                                 </div>
                                             </div>
                                         </div>

                                        <div v-else-if="blk.type === 'progress'" class="wf-progress-wrap">
                                            <div class="progress-info">
                                                <span class="p-label">{{ blk.label }}</span>
                                                <span class="p-val">{{ Math.round(blk.value / blk.max * 100) }}%</span>
                                            </div>
                                            <div class="progress-track">
                                                <div class="progress-bar" :style="{ width: (blk.value / blk.max * 100) + '%', background: blk.color || 'var(--accent)' }"></div>
                                            </div>
                                        </div>

                                        <div v-else-if="blk.type === 'image-gallery'" class="wf-image-gallery">
                                            <div class="gallery-grid">
                                                <img v-for="(src, gi) in (blk.images || '').split('\n').filter(s => s.trim())" :key="gi" :src="src" class="gallery-img" />
                                            </div>
                                        </div>

                                        <div v-else-if="blk.type === 'video'" class="wf-video-embed">
                                            <div class="video-placeholder">
                                                <Icon icon="lucide:play-circle" width="48" class="play-icon"></Icon>
                                                <div class="v-title">{{ blk.title }}</div>
                                                <div class="v-id">{{ blk.vid }}</div>
                                            </div>
                                        </div>

                                        <div v-else-if="blk.type === 'file'" class="wf-file-download-preview">
                                            <div class="wf-file-download" style="margin: 10px 0;">
                                                <Icon icon="lucide:file-text" width="20"></Icon>
                                                <div class="file-info">
                                                    <span class="file-label">{{ blk.label }}</span>
                                                    <span class="file-size">{{ blk.size }}</span>
                                                </div>
                                                <Icon icon="lucide:download" width="16" style="margin-left:auto"></Icon>
                                            </div>
                                        </div>

                                        <div v-else-if="blk.type === 'image'" class="canvas-image-wrap">
                                            <img :src="blk.src" style="width:100%; border-radius:12px; border:1px solid rgba(255,255,255,0.1)" />
                                            <div v-if="blk.caption" class="image-caption">{{ blk.caption }}</div>
                                        </div>

                                        <div v-else-if="blk.type === 'code'" class="canvas-code-box">
                                            <div class="code-hd">
                                                <div class="code-dots"><span></span><span></span><span></span></div>
                                                <span>{{ (blk.lang || 'text').toUpperCase() }}</span>
                                            </div>
                                            <pre><code>{{ blk.code }}</code></pre>
                                        </div>

                                        <div v-else-if="blk.type === 'table'" class="canvas-table-box">
                                            <table>
                                                <thead>
                                                    <tr><th v-for="h in (blk.headers || '').split(',')" :key="h">{{ h.trim() }}</th></tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(r, ri) in (blk.rows || '').split('\n').filter(s => s.trim())" :key="ri">
                                                        <td v-for="c in r.split(',')" :key="c">{{ c.trim() }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div v-else-if="blk.type === 'link'" style="padding:10px 0">
                                            <div class="wf-btn primary">
                                                <Icon icon="lucide:external-link" width="14"></Icon>
                                                <span>{{ blk.text }}</span>
                                            </div>
                                        </div>

                                        <div v-else-if="blk.type === 'collapse'" class="wf-info-collapse">
                                            <div class="wf-info-collapse-title">
                                                <Icon :icon="blk.icon || 'lucide:chevron-right'"></Icon>
                                                <span>{{ blk.title }}</span>
                                            </div>
                                            <div class="wf-info-collapse-body" style="display:block; padding:15px; opacity:0.7">
                                                {{ blk.body }}
                                            </div>
                                        </div>

                                        <div v-else-if="blk.type === 'divider'" class="wf-info-divider"></div>

                                        <div v-else-if="blk.type === 'stat'" class="wf-info-stat-item">
                                            <div class="wf-info-stat-number" :style="{ color: blk.color || 'var(--vp-c-brand-1)' }">{{ blk.value }}</div>
                                            <div class="wf-info-stat-label">{{ blk.label }}</div>
                                        </div>
                                        
                                        <div v-else class="preview-mini-placeholder">BLOCK: {{ blk.type.toUpperCase() }}</div>

                                        <div class="blk-overlay" v-if="editingBlkId === blk.id">
                                            <Icon icon="lucide:mouse-pointer-2" width="10"></Icon>
                                            <span>EDITING MODE</span>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div><div v-else class="code-render">
                        <div class="code-header">
                            <span>MARKDOWN EXPORT</span>
                            <button @click="copyMD"><Icon icon="lucide:copy" width="12"></Icon> COPY</button>
                        </div>
                        <pre><code>{{ generatedMD }}</code></pre>
                    </div>
                </div>
            </main>
        </div>

        <!-- ── Explorer Overlay ── -->
        <div v-if="showExplorer" class="studio-overlay" @click.self="showExplorer = false">
            <div class="studio-modal explorer-modal">
                <div class="modal-head">
                    <div class="modal-title">
                        <div class="title-icon-orb">
                            <Icon icon="lucide:database" width="20"></Icon>
                        </div>
                        <div class="title-text">
                            <span class="main-t">WIKI EXPLORER</span>
                            <span class="sub-t">Import and deconstruct existing pages</span>
                        </div>
                    </div>
                    <button class="modal-close" @click="showExplorer = false">
                        <Icon icon="lucide:x" width="18"></Icon>
                    </button>
                </div>
                        
                        <div class="explorer-body">
                            <aside class="explorer-sidebar">
                                <div class="explorer-search-box">
                                    <Icon icon="lucide:search" width="16"></Icon>
                                    <input v-model="explorerSearch" placeholder="Search pages..." spellcheck="false" />
                                </div>
                                <div class="explorer-tree-view">
                                   <div v-if="isLoadingTree" class="explorer-loader">
                                      <div class="studio-spinner"></div>
                                      <span>Connecting to GitHub...</span>
                                   </div>
                                   <div v-else class="tree-container">
                                      <div v-for="(files, section) in groupedFiles" :key="section" class="tree-section">
                                         <div class="section-hd">
                                            <Icon icon="lucide:folder" width="12"></Icon>
                                            <span>{{ section }}</span>
                                            <span class="count">{{ files.length }}</span>
                                         </div>
                                         <div v-for="f in files" :key="f.path" 
                                              class="tree-file" 
                                              :class="{ selected: selectedExplorerFile?.path === f.path }"
                                              @click="selectExplorerFile(f)">
                                            <div class="f-icon-wrap">
                                                <Icon icon="lucide:file-text" width="14" class="f-icon"></Icon>
                                            </div>
                                            <span class="f-name">{{ (f.name || f.path.split('/').pop() || '').replace('.md','') }}</span>
                                            <Icon v-if="selectedExplorerFile?.path === f.path" icon="lucide:chevron-right" width="12" class="f-arrow"></Icon>
                                         </div>
                                      </div>
                                      <div v-if="Object.keys(groupedFiles).length === 0 && !isLoadingTree" class="tree-empty">
                                          <div class="empty-glow-icon">
                                            <Icon icon="lucide:search-x" width="24"></Icon>
                                          </div>
                                          <span class="empty-title">NO MATCHES FOUND</span>
                                          <span class="empty-sub">We couldn't find any pages matching your search. Try a different term or branch.</span>
                                      </div>
                                   </div>
                                </div>
                            </aside>
                            
                            <main class="explorer-preview">
                               <div v-if="isLoadingContent" class="preview-loader">
                                  <div class="studio-spinner large"></div>
                                  <span>Deconstructing file content...</span>
                               </div>
                               <div v-else-if="selectedExplorerFile" class="preview-content">
                                  <div class="preview-toolbar">
                                     <div class="p-info">
                                        <span class="p-label">SELECTED PAGE</span>
                                        <span class="p-path">{{ selectedExplorerFile.path }}</span>
                                     </div>
                                     
                                     <div class="preview-mode-toggle">
                                        <button :class="{ active: explorerViewMode === 'code' }" @click="explorerViewMode = 'code'">CODE</button>
                                        <button :class="{ active: explorerViewMode === 'visual' }" @click="explorerViewMode = 'visual'">VISUAL</button>
                                     </div>

                                     <button class="studio-btn primary pulse" @click="importSelected">
                                        <Icon icon="lucide:import" width="14"></Icon>
                                        <span>IMPORT TO CANVAS</span>
                                     </button>
                                  </div>

                                  <div v-if="explorerViewMode === 'code'" class="code-view-box">
                                     <div class="code-view-hd">
                                        <div class="code-dots">
                                           <span></span><span></span><span></span>
                                        </div>
                                        <span class="code-filename">{{ selectedExplorerFile.name }}</span>
                                        <div class="code-stats">
                                           <span>{{ explorerContent.split('\n').length }} lines</span>
                                           <div class="v-sep-small"></div>
                                           <span>{{ (explorerContent.length / 1024).toFixed(1) }} KB</span>
                                        </div>
                                     </div>
                                     <div class="code-editor-sim">
                                        <div class="code-line-numbers">
                                           <div v-for="n in Math.min(explorerContent.split('\n').length, 50)" :key="n">{{ n }}</div>
                                        </div>
                                        <textarea readonly spellcheck="false" v-model="explorerContent"></textarea>
                                     </div>
                                     <div class="code-overlay"></div>
                                  </div>

                                  <div v-else class="visual-view-box">
                                     <div class="visual-preview-canvas" :class="['wf-theme-' + activeTheme]">
                                        <div class="canvas-blocks">
                                           <template v-for="blk in previewBlocks" :key="blk.id">
                                              <!-- Render a simplified version of blocks here -->
                                              <div class="canvas-blk-wrap miniature">
                                                 <div v-if="blk.type === 'section-title'" class="wf-info-title mini" :class="{ 'wf-system-title-hover': blk.gradient }">
                                                    <Icon :icon="blk.icon"></Icon>
                                                    <span>{{ blk.title }}</span>
                                                 </div>
                                                 <div v-else-if="blk.type === 'paragraph'" class="canvas-paragraph mini" v-html="renderInline(blk.body)"></div>
                                                 <div v-else-if="blk.type === 'card'" class="wf-info-card mini">
                                                    <div class="wf-info-icon mini"><Icon :icon="blk.icon"></Icon></div>
                                                <div class="wf-info-content">
                                                       <div class="mini-title">{{ blk.cardTitle }}</div>
                                                       <div class="mini-body">{{ blk.body.slice(0, 50) }}...</div>
                                                    </div>
                                                 </div>
                                                  <div v-else-if="blk.type === 'badge'" class="mini-badge-wrap"><span :class="'wf-info-' + (blk.variant === 'normal' ? 'badge' : blk.variant)">{{ blk.text }}</span></div>
                                                  <div v-else-if="blk.type === 'stat'" class="wf-info-stat-item mini">
                                                     <div class="wf-info-stat-number mini">{{ blk.value }}</div>
                                                     <div class="mini-fallback">{{ blk.label }}</div>
                                                  </div>
                                                  <div v-else-if="blk.type === 'image'" class="mini-image"><img :src="blk.src" style="width:100%; height:60px; object-fit:cover; border-radius:8px" /></div>
                                                  <div v-else-if="blk.type === 'video'" class="mini-fallback">🎬 Video: {{ blk.title }}</div>
                                                  <div v-else-if="blk.type === 'file'" class="mini-fallback">📁 File: {{ blk.label }}</div>
                                                  <div v-else-if="blk.type === 'stat-grid'" class="mini-fallback">📊 Data Grid ({{ (blk.body || '').split('\n').length }} items)</div>
                                                  <div v-else-if="blk.type === 'progress'" class="wf-progress-wrap mini"><div class="progress-track"><div class="progress-bar" :style="{ width: (blk.value/blk.max*100) + '%' }"></div></div></div>
                                                  <div v-else-if="blk.type === 'quote'" class="wf-lore-quote mini"><p>{{ blk.body.slice(0, 30) }}...</p></div>
                                                  <div v-else-if="blk.type === 'hero'" class="mini-fallback">✨ Hero: {{ blk.title }}</div>
                                                  <div v-else-if="blk.type === 'skill'" class="mini-fallback">⚡ Skill: {{ blk.name }}</div>
                                                  <div v-else-if="blk.type === 'alert'" class="mini-fallback">🚨 Alert: {{ blk.title }}</div>
                                                  <div v-else-if="blk.type === 'link-grid'" class="mini-fallback">🔗 Link Hub</div>
                                                  <div v-else class="mini-fallback">{{ getBlockLabel(blk.type) }}</div>
                                              </div>
                                           </template>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                               <div v-else class="preview-empty">
                                  <div class="empty-icon">
                                     <Icon icon="lucide:file-search" width="48"></Icon>
                                  </div>
                                  <h3>No Preview</h3>
                                  <p>Select a markdown file from the left sidebar to deconstruct its content.</p>
                               </div>
                            </main>
                        </div>
                    </div>
                </div>


        <!-- ── Custom Confirm Modal ── -->
        <Teleport to="body">
            <transition name="fade-scale">
                <div v-if="confirmDialog.show" class="studio-overlay" style="z-index: 1000000; pointer-events: auto !important;" @click="onConfirmCancel()">
                    <div class="studio-modal confirm-modal" style="pointer-events: auto !important; position: relative;" @click.stop>
                        <div class="modal-head" style="border-bottom: none; padding-bottom: 0;">
                            <div class="modal-title" style="color: var(--accent); display: flex; align-items: center; justify-content: center; width: 100%; gap: 8px;">
                                <Icon icon="lucide:alert-triangle" width="18" />
                                <span class="orbitron-font" style="font-size: 13px; letter-spacing: 2px;">{{ confirmDialog.title }}</span>
                            </div>
                        </div>
                        <div class="confirm-body">
                            <p>{{ confirmDialog.message }}</p>
                        </div>
                        <div class="confirm-actions">
                            <button class="confirm-btn cancel" @click="onConfirmCancel()">CANCEL</button>
                            <button class="confirm-btn proceed" @click="onConfirmProceed()">PROCEED</button>
                        </div>
                    </div>
                </div>
            </transition>
        </Teleport>

        <!-- Toast Notification -->
        <Transition name="toast">
            <div v-if="toast.show" class="studio-toast" :class="toast.type">
                <Icon :icon="toast.icon" width="18"></Icon>
                <span>{{ toast.message }}</span>
            </div>
        </Transition>

        <!-- ── Icon Picker Modal ── -->
<div v-if="showIconPicker" class="studio-overlay" @mousedown.self="showIconPicker = false" style="z-index: 99999; pointer-events: auto !important;">
            <div class="studio-modal icon-picker-modal" @mousedown.stop @click.stop style="pointer-events: auto !important; z-index: 100000; position: relative;">
                <div class="modal-head" style="pointer-events: auto !important;">
                    <div class="modal-title">
                        <div class="title-icon-orb" style="pointer-events: none;"><Icon icon="lucide:search" width="20"></Icon></div>
                        <div class="title-text" style="pointer-events: none;">
                            <span class="main-t">ICON PICKER</span>
                            <span class="sub-t">Browse Categorized Lucide Library</span>
                        </div>
                    </div>
                    <button type="button" class="modal-close" @click.stop.prevent="showIconPicker = false" style="pointer-events: auto !important;">
                        <Icon icon="lucide:x" width="18" style="pointer-events:none"></Icon>
                    </button>
                </div>
                
                <div class="icon-picker-content" style="pointer-events: auto !important;">
                    <aside class="icon-picker-sidebar" style="pointer-events: auto !important;">
                        <div class="small-hd">CATEGORIES</div>
                        <div class="cat-list">
                            <button type="button" v-for="cat in iconCategories" :key="cat.id"
                                    :class="{ active: activeIconCategory === cat.id }"
                                    @click.stop.prevent="activeIconCategory = cat.id" class="cat-menu-btn" style="pointer-events: auto !important;">
                                <Icon :icon="cat.icon" width="16" style="pointer-events:none"></Icon>
                                <span style="pointer-events:none">{{ cat.label }}</span>
                            </button>
                        </div>
                        <div class="sidebar-footer">
                            <button type="button" class="cat-menu-btn active" @click.stop.prevent="showIconPicker = false; toggleBodyScroll(false)" style="pointer-events: auto !important;">
                                <Icon icon="lucide:check" width="16" style="pointer-events:none"></Icon>
                                <span style="pointer-events:none">DONE</span>
                            </button>
                        </div>
                    </aside>

                    <main class="icon-picker-main" style="pointer-events: auto !important;">
                        <div class="explorer-search-box" style="pointer-events: auto !important;">
                            <Icon icon="lucide:search" width="16" style="pointer-events:none"></Icon>
                            <input v-model="iconSearch" placeholder="Search icons..." spellcheck="false" autofocus style="pointer-events: auto !important;" />
                        </div>

                        <div v-if="recentIcons.length > 0 && !iconSearch" class="recent-icons-section" style="pointer-events: auto !important;">
                            <div class="small-hd">RECENTLY USED</div>
                            <div class="recent-grid">
                                <button type="button" v-for="icon in recentIcons" :key="'recent-'+icon" @click.stop.prevent="selectIcon(icon)" class="recent-pick-btn" style="pointer-events: auto !important;">
                                    <Icon :icon="icon" width="20" style="pointer-events:none"></Icon>
                                    <div class="recent-tooltip" style="pointer-events:none">{{ icon.split(':')[1] }}</div>
                                </button>
                            </div>
                        </div>

                        <div class="icon-grid main-grid" style="pointer-events: auto !important;">
                            <button type="button" v-for="iconObj in filteredIcons" :key="iconObj.id" @click.stop.prevent="selectIcon(iconObj.id)" class="icon-pick-btn" style="pointer-events: auto !important;">
                                <Icon :icon="iconObj.id" width="24" style="pointer-events:none"></Icon>
                                <span style="pointer-events:none">{{ iconObj.id.split(':')[1] }}</span>
                            </button>
                        </div>

                        <div class="icon-picker-manual" style="pointer-events: auto !important;">
                            <label style="pointer-events:none">Manual Input (Iconify ID)</label>
                            <div class="studio-grid" style="pointer-events: auto !important;">
                                <input v-model="iconSearch" placeholder="lucide:target" style="pointer-events: auto !important;" />
                                <button type="button" @click.stop.prevent="selectIcon(iconSearch)" class="sidebar-add-btn" style="margin:0; pointer-events: auto !important;">SELECT</button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
        <!-- ── VS Code Style Status Bar ── -->
        <div class="pg-status-bar">
            <div class="status-left">
                <span class="status-item"><Icon icon="lucide:layers" width="12"/> {{ blocks.length }} BLOCKS</span>
                <span class="status-item"><Icon icon="lucide:file-text" width="12"/> {{ header.title || 'Untitled' }}</span>
                <span class="status-item accent" v-if="editingBlkId"><Icon icon="lucide:edit-3" width="12"/> EDITING: {{ getBlockLabel(blocks.find(b => b.id === editingBlkId)?.type) || 'Unknown' }}</span>
            </div>
            <div class="status-center" title="Auto-save status">
                <span v-if="isSaving" class="status-item saving"><Icon icon="lucide:loader-2" width="12" class="spin" /> Saving...</span>
                <span v-else class="status-item saved"><Icon icon="lucide:check-circle-2" width="12" /> {{ formatLastSaved() }}</span>
            </div>
            <div class="status-right">
                <button class="status-item btn" @click="undo" :disabled="historyPointer <= 0" title="Undo (Ctrl+Z)"><Icon icon="lucide:undo-2" width="12"/> Undo</button>
                <button class="status-item btn" @click="redo" :disabled="historyPointer >= history.length - 1" title="Redo (Ctrl+Y)"><Icon icon="lucide:redo-2" width="12"/> Redo</button>
                <span class="status-item"><Icon icon="lucide:bar-chart" width="12"/> {{ generatedMD.split(/\s+/).length }} words</span>
                <span class="status-item highlight"><Icon icon="lucide:tag" width="12"/> {{ header.tags?.[0]?.text || 'DRAFT' }}</span>
            </div>
        </div>
    </div>

    <!-- ── Backups Modal ── -->
    <Teleport to="body">
        <transition name="fade-scale">
            <div v-if="showBackups" class="studio-overlay" style="z-index: 99999; pointer-events: auto !important;" @click="showBackups = false">
                <div class="studio-modal backup-modal" style="pointer-events: auto !important; position: relative;" @click.stop>
                    <div class="modal-head">
                        <div class="modal-title">
                            <div class="title-icon-orb"><Icon icon="lucide:history" width="20" /></div>
                            <div class="title-text">
                                <span class="main-t">LOCAL BACKUPS</span>
                                <span class="sub-t">Restore from local storage</span>
                            </div>
                        </div>
                        <button class="modal-close" @click="showBackups = false"><Icon icon="lucide:x" width="18" /></button>
                    </div>
                    
                    <div class="backup-controls">
                        <input v-model="backupNameInput" placeholder="Name this backup (optional)..." class="backup-input" @keyup.enter="saveBackup(null)" />
                        <button class="backup-save-btn" @click="saveBackup(null)">
                            <Icon icon="lucide:save" width="14" />
                            <span>SAVE NOW</span>
                        </button>
                    </div>

                    <div class="backup-list">
                        <div v-if="!backups.length" class="empty-state">No backups saved yet.</div>
                        <div v-for="(b, idx) in backups" :key="b.id" class="backup-item">
                            <div class="backup-info">
                                <div class="backup-name">{{ b.name }}</div>
                                <div class="backup-meta">
                                    <Icon icon="lucide:clock" width="10" /> {{ new Date(b.date).toLocaleString() }}
                                    <span class="backup-count">• {{ b.blocks.length }} blocks</span>
                                </div>
                            </div>
                            <div class="backup-actions">
                                <button class="backup-action-btn restore" @click="restoreBackup(idx)" title="Restore this version">
                                    <Icon icon="lucide:clock-rewind" width="14" />
                                    <span>RESTORE</span>
                                </button>
                                <button class="backup-action-btn delete" @click="deleteBackup(idx)" title="Delete backup">
                                    <Icon icon="lucide:trash-2" width="14" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script>
import { defineComponent } from 'vue'
import { useData } from 'vitepress'
import { Icon } from '@iconify/vue'
import CS2Background from '../CS2Background.vue'
import LiquidMetalLogo from '../LiquidMetalLogo.vue'

export default defineComponent({
  name: 'PanelPageGenerator',
  components: { Icon, CS2Background, LiquidMetalLogo },
  props: {
    isLightTheme: { type: Boolean, default: false },
    githubToken: { type: String, default: '' },
    repoOwner: { type: String, default: 'WildFiire' },
    repoName: { type: String, default: 'docs' },
    repoBranch: { type: String, default: 'main' }
  },
  setup() {
     const { site } = useData()
     return { site }
  },
  data() {
    return {
      activeTheme: 'fire',
      viewMode: 'visual',
      showAddMenu: false,
      showExplorer: false,
      activePaletteGroup: 'All',
      paletteGroups: ['All','Text','Layout','Data','Atmospheric','Media','Elite'],
      importSummary: null,
      editingBlkId: null,
      copied: false,
      
      collapsed: {
          header: false,
          blocks: false
      },
      
      toast: { show: false, message: '', type: 'info', icon: 'lucide:info' },
      confirmDialog: { show: false, title: '', message: '' },
      
      // Explorer
      isLoadingTree: false,
      isLoadingContent: false,
      explorerSearch: '',
      allFiles: [],
      selectedExplorerFile: null,
      explorerContent: '',
      explorerViewMode: 'code',
      previewBlocks: [],
      
      // Icon Picker State
      showIconPicker: false,
      iconSearch: '',
      iconPickerTarget: { idx: null, field: 'icon' },
      
      iconCategories: [
        { id: 'all', label: 'ALL', icon: 'lucide:layout-grid' },
        { id: 'ui', label: 'UI & Layout', icon: 'lucide:monitor' },
        { id: 'actions', label: 'Actions', icon: 'lucide:mouse-pointer-2' },
        { id: 'media', label: 'Media', icon: 'lucide:image' },
        { id: 'status', label: 'Status', icon: 'lucide:info' },
        { id: 'gaming', label: 'Gaming', icon: 'lucide:gamepad-2' },
        { id: 'objects', label: 'Objects', icon: 'lucide:box' }
      ],
      activeIconCategory: 'all',
      recentIcons: [],
      
      iconLibrary: [
        // UI & Layout
        { id: 'lucide:zap', cat: 'ui' }, { id: 'lucide:star', cat: 'ui' }, { id: 'lucide:heart', cat: 'ui' },
        { id: 'lucide:settings', cat: 'ui' }, { id: 'lucide:menu', cat: 'ui' }, { id: 'lucide:search', cat: 'ui' },
        { id: 'lucide:bell', cat: 'ui' }, { id: 'lucide:home', cat: 'ui' }, { id: 'lucide:user', cat: 'ui' },
        { id: 'lucide:grid', cat: 'ui' }, { id: 'lucide:list', cat: 'ui' }, { id: 'lucide:layers', cat: 'ui' },
        
        // Actions
        { id: 'lucide:mouse-pointer-2', cat: 'actions' }, { id: 'lucide:plus', cat: 'actions' }, { id: 'lucide:minus', cat: 'actions' },
        { id: 'lucide:edit', cat: 'actions' }, { id: 'lucide:trash-2', cat: 'actions' }, { id: 'lucide:copy', cat: 'actions' },
        { id: 'lucide:download', cat: 'actions' }, { id: 'lucide:upload', cat: 'actions' }, { id: 'lucide:share-2', cat: 'actions' },
        { id: 'lucide:refresh-cw', cat: 'actions' }, { id: 'lucide:external-link', cat: 'actions' }, { id: 'lucide:link', cat: 'actions' },
        
        // Media
        { id: 'lucide:image', cat: 'media' }, { id: 'lucide:video', cat: 'media' }, { id: 'lucide:music', cat: 'media' },
        { id: 'lucide:play', cat: 'media' }, { id: 'lucide:pause', cat: 'media' }, { id: 'lucide:stop-circle', cat: 'media' },
        { id: 'lucide:camera', cat: 'media' }, { id: 'lucide:monitor', cat: 'media' }, { id: 'lucide:smartphone', cat: 'media' },
        { id: 'lucide:mic', cat: 'media' }, { id: 'lucide:volume-2', cat: 'media' }, { id: 'lucide:headphones', cat: 'media' },
        
        // Status
        { id: 'lucide:info', cat: 'status' }, { id: 'lucide:alert-circle', cat: 'status' }, { id: 'lucide:alert-triangle', cat: 'status' },
        { id: 'lucide:check-circle', cat: 'status' }, { id: 'lucide:help-circle', cat: 'status' }, { id: 'lucide:x-circle', cat: 'status' },
        { id: 'lucide:clock', cat: 'status' }, { id: 'lucide:shield', cat: 'status' }, { id: 'lucide:lock', cat: 'status' },
        { id: 'lucide:unlock', cat: 'status' }, { id: 'lucide:eye', cat: 'status' }, { id: 'lucide:eye-off', cat: 'status' },
        
        // Gaming
        { id: 'lucide:gamepad-2', cat: 'gaming' }, { id: 'lucide:target', cat: 'gaming' }, { id: 'lucide:crosshair', cat: 'gaming' },
        { id: 'lucide:swords', cat: 'gaming' }, { id: 'lucide:shield-check', cat: 'gaming' }, { id: 'lucide:trophy', cat: 'gaming' },
        { id: 'lucide:medal', cat: 'gaming' }, { id: 'lucide:crown', cat: 'gaming' }, { id: 'lucide:ghost', cat: 'gaming' },
        { id: 'lucide:skull', cat: 'gaming' }, { id: 'lucide:flame', cat: 'gaming' }, { id: 'lucide:bomb', cat: 'gaming' },
        
        // Objects
        { id: 'lucide:box', cat: 'objects' }, { id: 'lucide:package', cat: 'objects' }, { id: 'lucide:gift', cat: 'objects' },
        { id: 'lucide:briefcase', cat: 'objects' }, { id: 'lucide:map', cat: 'objects' }, { id: 'lucide:compass', cat: 'objects' },
        { id: 'lucide:key', cat: 'objects' }, { id: 'lucide:battery', cat: 'objects' }, { id: 'lucide:wrench', cat: 'objects' },
        { id: 'lucide:hammer', cat: 'objects' }, { id: 'lucide:terminal', cat: 'objects' }, { id: 'lucide:cpu', cat: 'objects' }
      ],
      
      themes: [
        { id: 'fire', label: 'FIRE', color: '#ff7800', wf: 'updates_wiki' },
        { id: 'system', label: 'SYSTEM', color: '#ef4444', wf: 'systems' },
        { id: 'market', label: 'MARKET', color: '#8b5cf6', wf: 'market' },
        { id: 'currency', label: 'CURRENCY', color: '#10b981', wf: 'currency' }
      ],
      
      blockTypes: [
        { id: 'section-title', label: 'Section Title', icon: 'lucide:heading-1', group: 'Layout' },
        { id: 'h2', label: 'Heading H2', icon: 'lucide:heading-2', group: 'Text' },
        { id: 'h3', label: 'Heading H3', icon: 'lucide:heading-3', group: 'Text' },
        { id: 'paragraph', label: 'Paragraph', icon: 'lucide:align-left', group: 'Text' },
        { id: 'card', label: 'Design Card', icon: 'lucide:layout', group: 'Layout' },
        { id: 'badge', label: 'Badge', icon: 'lucide:tag', group: 'Layout' },
        { id: 'tip', label: 'Info Box', icon: 'lucide:info', group: 'Layout' },
        { id: 'collapse', label: 'Collapsible', icon: 'lucide:chevron-down', group: 'Layout' },
        { id: 'feature-grid', label: 'Feature Grid', icon: 'lucide:layout-grid', group: 'Layout' },
        { id: 'timeline', label: 'Timeline', icon: 'lucide:list', group: 'Layout' },
        { id: 'image', label: 'Image / Media', icon: 'lucide:image', group: 'Media' },
        { id: 'link', label: 'Link Button', icon: 'lucide:link', group: 'Media' },
        { id: 'code', label: 'Code Block', icon: 'lucide:code-2', group: 'Media' },
        { id: 'table', label: 'Table', icon: 'lucide:table', group: 'Media' },
        { id: 'stat', label: 'Stat Item', icon: 'lucide:bar-chart-2', group: 'Layout' },
        { id: 'steps', label: 'Icon List', icon: 'lucide:list-checks', group: 'Layout' },
        { id: 'command', label: 'Command', icon: 'lucide:terminal', group: 'Media' },
        { id: 'image-gallery', label: 'Image Gallery', icon: 'lucide:layout-grid', group: 'Media' },
        { id: 'video', label: 'Video Embed', icon: 'lucide:play-circle', group: 'Media' },
        { id: 'file', label: 'File Download', icon: 'lucide:file-down', group: 'Media' },
        { id: 'stat-grid', label: 'KV Grid', icon: 'lucide:list-tree', group: 'Data' },
        { id: 'progress', label: 'Progress Bar', icon: 'lucide:loader-2', group: 'Data' },
        { id: 'quote', label: 'Lore Quote', icon: 'lucide:quote', group: 'Atmospheric' },
        { id: 'compare', label: 'Comparison', icon: 'lucide:columns-2', group: 'Atmospheric' },
        { id: 'divider', label: 'Divider', icon: 'lucide:minus', group: 'Layout' },
        { id: 'hero', label: 'Hero Section', icon: 'lucide:sparkles', group: 'Elite' },
        { id: 'skill', label: 'Skill Card', icon: 'lucide:zap', group: 'Elite' },
        { id: 'alert', label: 'Status Alert', icon: 'lucide:alert-circle', group: 'Elite' },
        { id: 'link-grid', label: 'Link Hub', icon: 'lucide:layout-grid', group: 'Elite' },
        { id: 'media-showcase', label: 'Media Showcase', icon: 'lucide:monitor', group: 'Elite' },
        { id: 'key-row', label: 'System Keys', icon: 'lucide:key', group: 'Elite' },
        { id: 'numbered-steps', label: 'Numbered Steps', icon: 'lucide:list-ordered', group: 'Elite' },
        { id: 'lore-header', label: 'Lore Header', icon: 'lucide:scroll', group: 'Elite' },
        { id: 'grid-start', label: 'Grid Container (Start)', icon: 'lucide:layout-grid', group: 'Elite' },
        { id: 'grid-end', label: 'Grid Container (End)', icon: 'lucide:layout-grid', group: 'Elite' }
      ],

      tagComponents: [
        'PageTagOrange', 'PageTagRed', 'PageTagBlue', 
        'PageTagGreen', 'PageTagPurple', 'PageTagYellow'
      ],
      
      header: {
        title: 'New Wiki Page',
        badge: 'Category',
        icon: 'lucide:file-text',
        pid: 'new-id',
        path: 'Home, Section',
        tags: [{ text: 'DRAFT', component: 'PageTagOrange' }],
        background: '/wallpaper/backgroundwf.webp',
        blurAmount: 6
      },
      
      blocks: [],
      nextBlkId: 1,

      // ── Undo / Redo History ──
      history: [],
      historyPointer: -1,
      isRestoring: false,
      _snapshotTimer: null,

      // ── Backups ──
      showBackups: false,
      backups: [],
      backupNameInput: '',
      lastSaved: null,
      autoSaveTimer: null,
      isSaving: false
    }
  },
  
  watch: {
    githubToken(newVal) {
      if (newVal) this.fetchFileTree();
    },
    showExplorer(newVal) {
      if (newVal && !this.allFiles.length) this.fetchFileTree();
      this.toggleBodyScroll(newVal);
    },
    showIconPicker(newVal) {
      this.toggleBodyScroll(newVal);
    },
    blocks: {
      deep: true,
      handler() { 
        if (!this.isRestoring) {
          this.debouncedSnapshot();
          this.autoSaveDraft();
        }
      }
    },
    header: {
      deep: true,
      handler() { 
        if (!this.isRestoring) {
          this.debouncedSnapshot();
          this.autoSaveDraft();
        }
      }
    },
    activeTheme() {
      if (!this.isRestoring) {
        this.snapshotState();
        this.autoSaveDraft();
      }
    }
  },
  
  computed: {
    themeStyles() {
      const t = this.themes.find(th => th.id === this.activeTheme) || this.themes[0];
      const wfColors = {
        'systems': { b1: '#ef4444', b2: '#dc2626', b3: '#b91c1c', soft: 'rgba(239, 68, 68, 0.16)' },
        'market': { b1: '#8b5cf6', b2: '#7c3aed', b3: '#6d28d9', soft: 'rgba(139, 92, 246, 0.16)' },
        'currency': { b1: '#10b981', b2: '#059669', b3: '#047857', soft: 'rgba(16, 185, 129, 0.16)' },
        'updates_wiki': { b1: '#ff7800', b2: '#ff5c1a', b3: '#ff4400', soft: 'rgba(255, 120, 0, 0.16)' }
      }[t.wf] || { b1: '#ff7800', b2: '#ff5c1a', b3: '#ff4400', soft: 'rgba(255, 120, 0, 0.16)' };

      const rgb = this.hexToRgb(t.color);

      return {
        '--accent': t.color,
        '--accent-rgb': rgb,
        '--accent-glow': `rgba(${rgb}, 0.15)`,
        '--accent-dim': `rgba(${rgb}, 0.08)`,
        '--vp-c-brand-1': wfColors.b1,
        '--vp-c-brand-2': wfColors.b2,
        '--vp-c-brand-3': wfColors.b3,
        '--vp-c-brand-soft': wfColors.soft,
        '--vp-c-brand-soft-rgb': this.hexToRgb(wfColors.soft),
        '--wf-info-highlight-color': wfColors.b1,
        '--wf-info-title-color': wfColors.b1,
        '--wf-accent-rgb': this.hexToRgb(wfColors.b1)
      };
    },

    headerPathArray() {
      return this.header.path.split(',').map(s => s.trim()).filter(s => s)
    },
    
    generatedMD() {
      let md = '---\nlayout: page\n---\n\n';
      md += `<CaseHeader\n  title="${this.header.title}"\n  badge-text="${this.header.badge}"\n  badge-icon="${this.header.icon}"\n  page-id="${this.header.pid}"\n  background="${this.header.background}"\n  :blur-amount="${this.header.blurAmount}"\n  :path="['${this.headerPathArray.join("', '")}']"\n  :tags="[\n`;
      this.header.tags.forEach(t => {
        md += `    { text: '${t.text}', component: '${t.component}' },\n`;
      });
      md += `  ]"\n/>\n\n`;
      this.blocks.forEach(b => {
        if (blkRenderers[b.type]) md += blkRenderers[b.type](b) + '\n\n';
      });
      return md.trim();
    },

    groupedFiles() {
      const grouped = {};
      const query = this.explorerSearch.toLowerCase();
      this.allFiles.forEach(f => {
        if (query && !f.path.toLowerCase().includes(query)) return;
        const parts = f.path.split('/');
        const section = parts.length > 1 ? parts[0].toUpperCase() : 'ROOT';
        if (!grouped[section]) grouped[section] = [];
        grouped[section].push(f);
      });
      return Object.keys(grouped).sort().reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {});
    },

    processedBlocks() {
      const result = [];
      let currentGrid = null;

      this.blocks.forEach(blk => {
        if (blk.type === 'grid-start') {
          currentGrid = {
            id: blk.id,
            type: 'grid-container',
            config: { cols: blk.cols || 2 },
            blocks: []
          };
        } else if (blk.type === 'grid-end') {
          if (currentGrid) {
            result.push(currentGrid);
            currentGrid = null;
          }
        } else {
          if (currentGrid) {
            currentGrid.blocks.push(blk);
          } else {
            result.push(blk);
          }
        }
      });

      if (currentGrid) result.push(currentGrid);
      return result;
    },

    filteredIcons() {
      let base = this.iconLibrary;
      if (this.activeIconCategory !== 'all') {
        base = base.filter(i => i.cat === this.activeIconCategory);
      }
      if (this.iconSearch) {
        const q = this.iconSearch.toLowerCase();
        base = base.filter(i => i.id.toLowerCase().includes(q));
      }
      return base;
    },

    filteredPaletteBlocks() {
      if (this.activePaletteGroup === 'All') return this.blockTypes;
      return this.blockTypes.filter(b => b.group === this.activePaletteGroup);
    },

    importBlockSummary() {
      if (!this.importSummary) return null;
      const counts = {};
      this.importSummary.forEach(b => { counts[b.type] = (counts[b.type] || 0) + 1; });
      return counts;
    }
  },

  methods: {
    getBlockColor(type) {
      const colors = {
        'section-title': '#ff7800', 'h2': '#e2e8f0', 'h3': '#94a3b8',
        'paragraph': '#64748b', 'card': '#3b82f6', 'badge': '#8b5cf6',
        'tip': '#10b981', 'collapse': '#f59e0b', 'image': '#ec4899',
        'link': '#06b6d4', 'code': '#22c55e', 'table': '#6366f1',
        'stat': '#ff7800', 'divider': '#334155', 'feature-grid': '#10b981',
        'timeline': '#f59e0b', 'image-gallery': '#ec4899', 'video': '#ef4444',
        'file': '#06b6d4', 'stat-grid': '#3b82f6', 'progress': '#22c55e',
        'quote': '#8b5cf6', 'compare': '#ff7800', 'hero': '#ff7800',
        'skill': '#f59e0b', 'alert': '#ef4444', 'link-grid': '#3b82f6'
      };
      return colors[type] || '#64748b';
    },

    hexToRgb(hex) {
      if (!hex) return '255, 120, 0';
      if (hex.startsWith('rgba')) {
        const m = hex.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
        return m ? `${m[1]}, ${m[2]}, ${m[3]}` : '255, 120, 0';
      }
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 120, 0';
    },

    getIcon(type) {
       const bt = this.blockTypes.find(b => b.id === type);
       return bt?.icon || 'lucide:box';
    },

    getBlockLabel(type) {
      const labels = {
        'section-title': 'Section Title', 'h2': 'Heading H2', 'h3': 'Heading H3',
        'paragraph': 'Paragraph', 'card': 'Design Card', 'badge': 'Badge',
        'tip': 'Info Box', 'collapse': 'Collapsible', 'image': 'Image / Media',
        'link': 'Link Button', 'code': 'Code Block', 'table': 'Table',
        'stat': 'Stat Item', 'divider': 'Divider', 'feature-grid': 'Feature Grid',
        'timeline': 'Timeline', 'image-gallery': 'Gallery', 'video': 'Video',
        'file': 'File', 'stat-grid': 'KV Grid', 'progress': 'Progress',
        'quote': 'Lore Quote', 'compare': 'Comparison', 'hero': 'Hero Section',
        'skill': 'Skill Card', 'alert': 'Status Alert', 'link-grid': 'Link Hub',
        'steps': 'Icon List', 'command': 'Command'
      };
      return labels[type] || type;
    },

    getBlockPreview(blk) {
      const val = blk.title || blk.body || blk.text || blk.src || blk.code || blk.value || '';
      const str = String(val);
      const clean = str.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\n/g, ' ');
      return clean.length > 32 ? clean.slice(0, 32) + '…' : clean;
    },

    askConfirm(title, message) {
      return new Promise((resolve) => {
        this.confirmDialog = { show: true, title, message };
        this._confirmResolve = resolve;
      });
    },

    onConfirmProceed() {
      this.confirmDialog.show = false;
      if (this._confirmResolve) this._confirmResolve(true);
    },

    onConfirmCancel() {
      this.confirmDialog.show = false;
      if (this._confirmResolve) this._confirmResolve(false);
    },

    showToast(message, type = 'info', icon = 'lucide:info') {
       this.toast = { show: true, message, type, icon };
       setTimeout(() => { this.toast.show = false }, 3000);
    },

    openExplorer() {
      console.log('PGE: Opening Explorer');
      this.showExplorer = true;
      if (!this.allFiles.length) {
        this.fetchFileTree();
      }
    },

    async fetchFileTree() {
      const token = this.githubToken || localStorage.getItem('github_token');
      console.log('PGE: Fetching file tree, token exists:', !!token);
      
      if (!token || token === 'dev_token_123') {
        this.isLoadingTree = false;
        this.showToast(token === 'dev_token_123' ? 'GitHub Login Required (DevMode)' : 'Authentication required', 'error', 'lucide:lock');
        return;
      }
      
      this.isLoadingTree = true;
      try {
        // Try with Bearer first
        let res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees/${this.repoBranch}?recursive=1`, {
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/vnd.github.v3+json' 
          }
        });
        
        // Fallback to 'token' if 401
        if (res.status === 401) {
           console.log('PGE: 401 with Bearer, trying "token" prefix');
           res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees/${this.repoBranch}?recursive=1`, {
             headers: { 
               'Authorization': `token ${token}`, 
               'Accept': 'application/vnd.github.v3+json' 
             }
           });
        }

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || `GitHub API Error: ${res.status}`);
        }
        
        const data = await res.json();
        this.allFiles = data.tree
          .filter(f => f.type === 'blob' && f.path.endsWith('.md'))
          .map(f => ({ path: f.path, sha: f.sha }));
        
        console.log(`PGE: Found ${this.allFiles.length} markdown files`);
      } catch (err) {
        console.error('PGE: Explorer Error:', err);
        this.showToast(err.message, 'error', 'lucide:alert-circle');
      } finally {
        this.isLoadingTree = false;
      }
    },

    async selectExplorerFile(file) {
      this.selectedExplorerFile = file;
      this.isLoadingContent = true;
      const token = this.githubToken || localStorage.getItem('github_token');
      try {
        let res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${file.path}?ref=${this.repoBranch}`, {
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/vnd.github.v3+json' 
          }
        });
        
        if (res.status === 401) {
           res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${file.path}?ref=${this.repoBranch}`, {
             headers: { 
               'Authorization': `token ${token}`, 
               'Accept': 'application/vnd.github.v3+json' 
             }
           });
        }

        if (res.ok) {
          const data = await res.json();
          const binary = atob(data.content.replace(/\n/g, ''));
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          this.explorerContent = new TextDecoder().decode(bytes);
          this.generatePreviewBlocks();
        }
      } catch (e) { console.error('PGE: File Content Error:', e); }
      finally { this.isLoadingContent = false; }
    },

    generatePreviewBlocks() {
       // Simplified deconstruction for visual preview in explorer
       const tempBlocks = this.blocks; // backup
       this.handleImport(this.explorerContent);
       this.previewBlocks = JSON.parse(JSON.stringify(this.blocks));
       this.blocks = tempBlocks; // restore original
    },

    importSelected() {
       if (!this.explorerContent) return;
       this.handleImport(this.explorerContent);
       this.showExplorer = false;
       this.showToast('Page deconstructed successfully', 'success', 'lucide:sparkles');
    },

    handleImport(md) {
        const getVal = (reg, text) => { const m = text.match(reg); return m ? m[1] : null; };
        
        // 1. Extract CaseHeader data
        const headerMatch = md.match(/<CaseHeader[\s\S]*?\/>/);
        if (headerMatch) {
            const h = headerMatch[0];
            this.header.title = getVal(/title="(.*?)"/, h) || this.header.title;
            this.header.badge = getVal(/badge-text="(.*?)"/, h) || this.header.badge;
            this.header.icon = getVal(/badge-icon="(.*?)"/, h) || this.header.icon;
            this.header.pid = getVal(/page-id="(.*?)"/, h) || this.header.pid;
            this.header.background = getVal(/background="(.*?)"/, h) || this.header.background;
            const blur = getVal(/:blur-amount="(.*?)"/, h) || getVal(/blur-amount="(.*?)"/, h);
            if (blur) this.header.blurAmount = parseInt(blur);
            
            const pathMatch = h.match(/:path="\[(.*?)]"/);
            if (pathMatch) {
                this.header.path = pathMatch[1].replace(/'/g, '').split(',').map(s => s.trim()).join(', ');
            }

            const tagsMatch = h.match(/:tags="\[([\s\S]*?)]"/);
            if (tagsMatch) {
                const tagsStr = tagsMatch[1];
                const tagRegex = /\{\s*text:\s*'(.*?)',\s*component:\s*'(.*?)'\s*\}/g;
                let tm;
                const tags = [];
                while ((tm = tagRegex.exec(tagsStr)) !== null) {
                    tags.push({ text: tm[1], component: tm[2] });
                }
                if (tags.length > 0) this.header.tags = tags;
            }
        } else {
            // Fallback to frontmatter title if no CaseHeader
            this.header.title = getVal(/^title:\s*"(.*?)"/m, md) || this.header.title;
        }

        // 2. Prepare body
        let body = md.replace(/---[\s\S]*?---/, '').replace(/<CaseHeader[\s\S]*?\/>/, '').trim();
        
        // 3. Scan for blocks
        const found = [];
        const nextId = () => this.nextBlkId++;

        const addFound = (idx, len, data) => {
            found.push({ index: idx, length: len, data });
        };

        // Section Titles (Modern and Legacy)
        const stRegex = /<div[^>]*class="[^"]*(?:wf-info-title|wf-currency-title-hover|wf-system-title-hover)[^"]*"[^>]*>[\s\S]*?(?:<div[^>]*class="wf-info-number"[^>]*>(.*?)<\/div>)?[\s\S]*?(?:(?:<span>|### <span[^>]*>)[\s\S]*?)?<Icon[^>]*icon="([^"]*)"[^>]*>[\s\S]*?(?:<span>|### <span[^>]*>)?(.*?)(?:<\/span>|### <\/span>)[\s\S]*?<\/div>/g;
        let m;
        while ((m = stRegex.exec(body)) !== null) {
            const color = (m[0].match(/style="[^"]*color:\s*([^;"]*)/) || [])[1] || '';
            const gradient = m[0].includes('wf-system-title-hover') || m[0].includes('background: linear-gradient');
            addFound(m.index, m[0].length, { type: 'section-title', icon: m[2], num: m[1] || '', title: m[3].replace(/<[^>]*>/g, '').trim(), color, gradient });
        }

        // Steps / Icon List
        const stepsRegex = /<ul[^>]*class="[^"]*(?:wf-system-custom-list|wf-info-list)[^"]*"[^>]*>([\s\S]*?)<\/ul>/g;
        while ((m = stepsRegex.exec(body)) !== null) {
            const items = [];
            const liRegex = /<li>[\s\S]*?<Icon[^>]*icon="([^"]*)"[^>]*>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<\/li>/g;
            let li;
            while ((li = liRegex.exec(m[1])) !== null) {
                items.push(`${li[1]}|${li[2].replace(/<[^>]*>/g, '').trim()}`);
            }
            addFound(m.index, m[0].length, { type: 'steps', body: items.join('\n'), color: '' });
        }


        // Lore Header
        const loreRegex = /<div style="text-align:\s*center;[^"]*">[\s\S]*?opacity:\s*0\.6;">(.*?)<\/div>[\s\S]*?<h2[^>]*>(.*?)<\/h2>[\s\S]*?<\/div>/g;
        while ((m = loreRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'lore-header', sub: m[1].trim(), title: m[2].replace(/<[^>]*>/g, '').trim() });
        }

        // Grid Container
        const gsRegex = /<div class="wf-info-grid"(?:\s*style="grid-template-columns:\s*repeat\((\d+),\s*1fr\);")?>/g;
        while ((m = gsRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'grid-start', cols: m[1] ? parseInt(m[1]) : 2 });
        }
        const geRegex = /<\/div><!-- grid-end -->/g;
        while ((m = geRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'grid-end' });
        }

        // Key Row
        const krRegex = /<div class="wf-system-key-row">([\s\S]*?)<\/div>/g;
        while ((m = krRegex.exec(body)) !== null) {
            const items = [];
            const kiRegex = /<span class="wf-system-key-button">(.*?)<\/span><span>(.*?)<\/span>/g;
            let ki;
            while ((ki = kiRegex.exec(m[1])) !== null) {
                items.push(`${ki[1]}|${ki[2].replace(/<[^>]*>/g, '').trim()}`);
            }
            addFound(m.index, m[0].length, { type: 'key-row', body: items.join('\n') });
        }

        // Tip Boxes
        const tipRegex = /<div[^>]*class="[^"]*wf-system-tip[^"]*"[^>]*>[\s\S]*?<Icon[^>]*icon="([^"]*)"[^>]*>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<\/div>/g;
        while ((m = tipRegex.exec(body)) !== null) {
            const qtype = m[0].includes('orange') ? 'orange' : 'green';
            addFound(m.index, m[0].length, { type: 'tip', icon: m[1], body: m[2].replace(/<[^>]*>/g, '').trim(), qtype });
        }

        // Commands
        const cmdRegex = /<div style="[^"]*display:\s*flex;\s*flex-direction:\s*column;[^"]*">[\s\S]*?<span[^>]*>(.*?)<\/span>[\s\S]*?<code[^>]*>(.*?)<\/code>[\s\S]*?<\/div>/g;
        while ((m = cmdRegex.exec(body)) !== null) {
            const color = (m[0].match(/color:\s*([^;"]*)/) || [])[1] || '';
            addFound(m.index, m[0].length, { type: 'command', label: m[1].trim(), body: m[2].trim(), color });
        }

        // H2 / H3
        const hRegex = /^(#{2,3})\s+(.*)$/gm;
        while ((m = hRegex.exec(body)) !== null) {
            // Only add if not already part of another block (like legacy title)
            if (!found.some(f => m.index >= f.index && m.index < f.index + f.length)) {
                const type = m[1].length === 2 ? 'h2' : 'h3';
                const color = (m[2].match(/style="[^"]*color:\s*([^;"]*)/) || [])[1] || '';
                const title = m[2].replace(/\{#.*\}$/, '').replace(/<[^>]*>/g, '').trim();
                const link = (m[2].match(/\{#(.*?)\}/) || [])[1] || '';
                addFound(m.index, m[0].length, { type, title, link, color });
            }
        }

        // Cards (Modern and Legacy)
        const cardRegex = /(?:<a[^>]*href="([^"]*)"[^>]*>\s*)?<div[^>]*class="[^"]*(?:wf-info-card|wf-currency-card)[^"]*"[^>]*>([\s\S]*?<div[^>]*class="[^"]*(?:wf-info-content|wf-currency-content)[^"]*"[^>]*>[\s\S]*?<\/div>[\s\S]*?)<\/div>(?:\s*<\/a>)?/g;
        while ((m = cardRegex.exec(body)) !== null) {
            const link = m[1] || '';
            const content = m[2];
            const color = (m[0].match(/style="[^"]*(?:color|border-left-color):\s*([^;"]*)/) || [])[1] || '';
            const icon = (content.match(/<Icon[^>]*icon="([^"]*)"/) || [])[1] || 'lucide:box';
            const num = (content.match(/<(?:div|span)[^>]*class="[^"]*(?:wf-info-number|wf-currency-number)[^"]*"[^>]*>(.*?)<\/(?:div|span)>/) || [])[1] || '';
            const cardTitle = (content.match(/<div[^>]*style="[^"]*font-weight:\s*700[^"]*"[^>]*>(.*?)<\/div>/) || [])[1] || '';
            const image = (content.match(/<img[^>]*src="([^"]*)"/) || [])[1] || '';
            const overlayMatch = content.match(/backdrop-filter:\s*blur\(4px\);[^>]*>([^<]+)<\/div>/);
            const layout = m[0].includes('side-layout') ? 'side' : 'top';
            const isGrid = m[0].includes('width: calc(50% - 10px)') || m[0].includes('grid-item');
            const borderPosMatch = m[0].match(/border-(left|right|top|bottom):/);
            const borderPos = borderPosMatch ? borderPosMatch[1] : 'left';
            
            addFound(m.index, m[0].length, { 
                type: 'card', icon, num, cardTitle, image, overlayLabel: overlayMatch ? overlayMatch[1] : '', 
                layout, link, color, isGrid, borderPos, body: '' 
            });
            
            // Extra Links
            const extraLinkRegex = /<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
            const links = [];
            let lM;
            while ((lM = extraLinkRegex.exec(content)) !== null) {
              if (lM[1] !== link) links.push({ text: lM[2], href: lM[1] });
            }

            let b = content.replace(/<(?:div|span)[^>]*class="[^"]*(?:wf-info-number|wf-currency-number)[^"]*"[^>]*>.*?<\/(?:div|span)>/g, '')
                           .replace(/<(?:div|span)[^>]*class="[^"]*(?:wf-info-icon|wf-currency-icon)[^"]*"[^>]*>[\s\S]*?<\/(?:div|span)>/g, '')
                           .replace(/<div[^>]*style="[^"]*font-weight:\s*700[^"]*"[^>]*>.*?<\/div>/g, '')
                           .replace(/<div[^>]*class="[^"]*(?:wf-info-content|wf-currency-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/, '$1')
                           .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, '$1\n')
                           .replace(/<br\s*\/?>/g, '\n')
                           .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
                           .replace(/<a[^>]*>.*?<\/a>/g, '') // Clean links out of body
                           .replace(/<[^>]*>/g, '')
                           .trim();
            addFound(m.index, m[0].length, { 
                type: 'card', icon, number: num, body: b, isGrid: m[0].includes('grid-item'), 
                color, cardTitle, image, link, overlayLabel: overlayMatch ? overlayMatch[1] : '',
                layout, links: links.length > 0 ? links : []
            });
        }

        // Tips / Boxes
        const fallbackBoxRegex = /<div[^>]*class="[^"]*(?:wf-info-box|wf-system-tip)[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = fallbackBoxRegex.exec(body)) !== null) {
            if (found.some(f => m.index >= f.index && m.index < f.index + f.length)) continue;
            const content = m[1];
            const icon = (content.match(/<Icon[^>]*icon="([^"]*)"/) || [])[1] || 'lucide:info';
            let b = content.replace(/<Icon[^>]*\/>/g, '')
                           .replace(/<div[^>]*>([\s\S]*?)<\/div>/, '$1')
                           .replace(/<span[^>]*>([\s\S]*?)<\/span>/, '$1')
                           .replace(/<br\s*\/?>/g, '\n')
                           .replace(/<[^>]*>/g, '')
                           .trim();
            addFound(m.index, m[0].length, { type: 'tip', icon, body: b });
        }

        // Badges
        const badgeRegex = /<span[^>]*class="[^"]*wf-info-(badge|punish|step|highlight)[^"]*"[^>]*>(.*?)<\/span>/g;
        while ((m = badgeRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'badge', variant: m[1] === 'badge' ? 'normal' : m[1], text: m[2] });
        }

        // Collapsibles
        const collRegex = /<div[^>]*class="[^"]*wf-info-collapse[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = collRegex.exec(body)) !== null) {
            const content = m[1];
            const icon = (content.match(/<Icon[^>]*icon="([^"]*)"/) || [])[1] || 'lucide:chevron-down';
            const title = (content.match(/<div[^>]*class="[^"]*wf-info-collapse-title"[^>]*>(.*?)<\/div>/) || [])[1] || 'Collapsible';
            const b = content.split(/<\/div>/).pop().replace(/<[^>]*>/g, '').trim();
            addFound(m.index, m[0].length, { type: 'collapse', icon, title, body: b });
        }

        // Dividers
        const divRegex = /<div[^>]*class="[^"]*wf-info-divider[^"]*"[^>]*>[\s\S]*?<\/div>/g;
        while ((m = divRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'divider' });
        }

        // Stats
        const statRegex = /<div[^>]*class="[^"]*wf-info-stat-item[^"]*"[^>]*>[\s\S]*?<div[^>]*class="wf-info-stat-number"[^>]*>(.*?)<\/div>[\s\S]*?<div[^>]*class="wf-info-stat-label"[^>]*>(.*?)<\/div>[\s\S]*?<\/div>/g;
        while ((m = statRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'stat', value: m[1], label: m[2] });
        }

        // Feature Grid
        const fgRegex = /<div[^>]*class="[^"]*wf-feature-grid[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = fgRegex.exec(body)) !== null) {
            const titleMatch = m[1].match(/class="(?:feature-grid-title|feature-header)">([^<]+)<\/div>/);
            const itemRegex = /<Icon icon="([^"]+)" \/>\n\s*<span>([^<]+)<\/span>/g;
            const items = [];
            let iM;
            while ((iM = itemRegex.exec(m[1])) !== null) items.push(`${iM[1]}|${iM[2]}`);
            addFound(m.index, m[0].length, { type: 'feature-grid', title: titleMatch ? titleMatch[1] : 'Features', items: items.join('\n') });
        }

        // Timeline
        const tlRegex = /<div[^>]*class="[^"]*wf-timeline[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = tlRegex.exec(body)) !== null) {
            const stepRegex = /<div class="timeline-point">[\s\S]*?<strong>([^<]+)<\/strong>[\s\S]*?<span>([^<]+)<\/span>/g;
            const steps = [];
            let sM;
            while ((sM = stepRegex.exec(m[1])) !== null) steps.push(`${sM[1]}|${sM[2]}`);
            addFound(m.index, m[0].length, { type: 'timeline', body: steps.join('\n') });
        }

        // Image Gallery
        const igRegex = /<div[^>]*class="[^"]*wf-image-gallery[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = igRegex.exec(body)) !== null) {
            const imgRegex = /<img src="([^"]+)" \/>/g;
            const images = [];
            let imM;
            while ((imM = imgRegex.exec(m[1])) !== null) images.push(imM[1]);
            addFound(m.index, m[0].length, { type: 'image-gallery', images: images.join('\n') });
        }

        // Video Embed
        const vRegex = /<div[^>]*class="[^"]*wf-video-embed[^"]*"[^>]*>[\s\S]*?<iframe src="https:\/\/www.youtube.com\/embed\/([^"]+)" title="([^"]*)"/g;
        while ((m = vRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'video', platform: 'youtube', vid: m[1], title: m[2] });
        }

        // File Download
        const fRegex = /<a[^>]*class="[^"]*wf-file-download[^"]*"[^>]*href="([^"]*)">[\s\S]*?<span class="file-label">([^<]+)<\/span>[\s\S]*?<span class="file-size">([^<]+)<\/span>/g;
        while ((m = fRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'file', url: m[1], label: m[2], size: m[3] });
        }

        // Stat Grid (KV)
        const sgRegex = /<div[^>]*class="[^"]*wf-stat-grid[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = sgRegex.exec(body)) !== null) {
            const kvRegex = /<span class="kv-key">([^<]+)<\/span><span class="kv-val">([^<]+)<\/span>/g;
            const items = [];
            let kvM;
            while ((kvM = kvRegex.exec(m[1])) !== null) items.push(`${kvM[1]}|${kvM[2]}`);
            addFound(m.index, m[0].length, { type: 'stat-grid', body: items.join('\n') });
        }

        // Progress Bar
        const pRegex = /<div[^>]*class="[^"]*wf-progress-wrap[^"]*"[^>]*>[\s\S]*?<span>([^<]+)<\/span><span>(\d+)%<\/span>[\s\S]*?background:\s*([^;"]*)/g;
        while ((m = pRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'progress', label: m[1], value: parseInt(m[2]), max: 100, color: m[3] });
        }

        // Numbered Steps (Elite & Legacy)
        const nsRegexFull = /<div[^>]*class="[^"]*wf-numbered-steps"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = nsRegexFull.exec(body)) !== null) {
            const stepRegex = /<div class="step-text">([\s\S]*?)<\/div>/g;
            const legacyStepRegex = /<div class="step-content"><strong>(.*?)<\/strong><p>(.*?)<\/p><\/div>/g;
            const steps = [];
            let sM;
            if (m[1].includes('step-content')) {
                while ((sM = legacyStepRegex.exec(m[1])) !== null) steps.push(`${sM[1].trim()}|${sM[2].trim()}`);
            } else {
                while ((sM = stepRegex.exec(m[1])) !== null) steps.push(sM[1].trim());
            }
            addFound(m.index, m[0].length, { type: 'numbered-steps', body: steps.join('\n') });
        }

        // Lore Header (Elite)
        const lhRegex = /<div[^>]*class="[^"]*wf-lore-header"[^>]*>[\s\S]*?<div class="lore-sub">([^<]+)<\/div>[\s\S]*?<h2 class="lore-title">([^<]+)<\/h2>/g;
        while ((m = lhRegex.exec(body)) !== null) {
            const color = (m[0].match(/--accent:\s*([^;"]*)/) || [])[1] || '';
            addFound(m.index, m[0].length, { type: 'lore-header', sub: m[1], title: m[2], color });
        }

        // Link Hub (Elite)
        const lhHubRegex = /<div[^>]*class="[^"]*wf-link-hub"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = lhHubRegex.exec(body)) !== null) {
            const linkRegex = /<Icon icon="([^"]+)" \/>\n?\s*<span>([^<]+)<\/span>/g;
            const links = [];
            let lM;
            while ((lM = linkRegex.exec(m[1])) !== null) links.push(`${lM[1]}|${lM[2]}`);
            addFound(m.index, m[0].length, { type: 'link-grid', links: links.join('\n') });
        }

        // Hero Section
        const heroRegex = /<div[^>]*class="[^"]*wf-hero-section"[^>]*style="background-image:\s*url\(([^)]+)\)"[^>]*>[\s\S]*?<div[^>]*class="hero-badge"[^>]*>([^<]+)<\/div>[\s\S]*?<h1>([^<]+)<\/h1>[\s\S]*?<p>([^<]+)<\/p>/g;
        while ((m = heroRegex.exec(body)) !== null) {
            const color = (m[0].match(/color:\s*([^;"]*)/) || [])[1] || '';
            addFound(m.index, m[0].length, { type: 'hero', image: m[1], badge: m[2], title: m[3], subtitle: m[4], color });
        }

        // Skill Card
        const skillRegex = /<div[^>]*class="[^"]*wf-skill-card"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = skillRegex.exec(body)) !== null) {
            const content = m[1];
            const icon = (content.match(/<Icon[^>]*icon="([^"]*)"/) || [])[1] || '';
            const color = (content.match(/color:\s*([^;"]*)/) || [])[1] || '';
            const name = (content.match(/<span class="skill-name">([^<]+)<\/span>/) || [])[1] || '';
            const type = (content.match(/<span class="skill-type">([^<]+)<\/span>/) || [])[1] || '';
            const bodyText = (content.match(/<p class="skill-desc">([\s\S]*?)<\/p>/) || [])[1] || '';
            const cost = (content.match(/<span>Cost<\/span><span>([^<]+)<\/span>/) || [])[1] || '';
            const cd = (content.match(/<span>CD<\/span><span>([^<]+)s?<\/span>/) || [])[1] || '';
            const statRegexItem = /<div class="skill-stat"><span>([^<]+)<\/span><span>([^<]+)<\/span><\/div>/g;
            const stats = [];
            let stM;
            while ((stM = statRegexItem.exec(content)) !== null) {
              if (stM[1] !== 'Cost' && stM[1] !== 'CD') stats.push(`${stM[1]}|${stM[2]}`);
            }
            addFound(m.index, m[0].length, { type: 'skill', icon, color, name, type_label: type, desc: bodyText, stats: stats.join('\n'), cost, cd });
        }

        // Media Showcase (Elite)
        const msRegex = /<div[^>]*class="[^"]*media-showcase-wrap"[^>]*>[\s\S]*?<img src="([^"]+)"[^>]*>[\s\S]*?<div class="media-badge">([^<]+)<\/div>[\s\S]*?<div class="media-caption">([^<]+)<\/div>/g;
        while ((m = msRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'media-showcase', image: m[1], label: m[2], caption: m[3] });
        }

        // Grid Containers
        const gridStartRegex = /<div[^>]*class="[^"]*wf-info-grid"[^>]*style="grid-template-columns:\s*repeat\((\d+),\s*1fr\);"[^>]*>/g;
        while ((m = gridStartRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'grid-start', cols: parseInt(m[1]) });
        }
        const gridEndRegex = /<\/div><!-- grid-end -->/g;
        while ((m = gridEndRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'grid-end' });
        }

        // Lore Quote
        const qRegex = /<blockquote[^>]*class="[^"]*wf-lore-quote[^"]*"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?(?:<cite>— (.*?)<\/cite>)?[\s\S]*?<\/blockquote>/g;
        while ((m = qRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'quote', body: m[1].trim(), author: m[2] || '' });
        }

        // Comparison
        const cRegex = /<div[^>]*class="[^"]*wf-compare-block[^"]*"[^>]*>[\s\S]*?<div class="compare-side left"><Icon icon="([^"]*)" \/><span>([^<]*)<\/span><\/div>[\s\S]*?<div class="compare-side right"><Icon icon="([^"]*)" \/><span>([^<]*)<\/span><\/div>[\s\S]*?<table>([\s\S]*?)<\/table>/g;
        while ((m = cRegex.exec(body)) !== null) {
            const trRegex = /<tr><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/g;
            const rows = [];
            let trM;
            while ((trM = trRegex.exec(m[5])) !== null) rows.push(`${trM[1]}|${trM[2]}|${trM[3]}`);
            addFound(m.index, m[0].length, { 
                type: 'compare', 
                leftIcon: m[1], leftTitle: m[2], 
                rightIcon: m[3], rightTitle: m[4],
                body: rows.join('\n')
            });
        }

        // Images
        const imgRegex = /!\[(.*?)\]\((.*?)\)(?:\n\*(.*)\*)?/g;
        while ((m = imgRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'image', alt: m[1], src: m[2], caption: m[3] || '' });
        }

        // Links
        const linkRegex = /\[(.*?)\]\((.*?)\)(?: \(opens in new tab\))?/g;
        while ((m = linkRegex.exec(body)) !== null) {
            if (found.some(f => m.index >= f.index && m.index < f.index + f.length)) continue;
            addFound(m.index, m[0].length, { type: 'link', text: m[1], href: m[2], external: m[0].includes('opens in new tab') });
        }

        // Code Blocks
        const codeRegex = /```(\w+)\n([\s\S]*?)\n```/g;
        while ((m = codeRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'code', lang: m[1], code: m[2] });
        }



        // Status Alert
        const alertRegex = /<div[^>]*class="[^"]*wf-status-alert\s*([^"]*)"[^>]*>[\s\S]*?<Icon icon="([^"]*)"[^>]*>[\s\S]*?<span class="alert-title">([^<]+)<\/span>[\s\S]*?<p>([^<]+)<\/p>/g;
        while ((m = alertRegex.exec(body)) !== null) {
            addFound(m.index, m[0].length, { type: 'alert', variant: m[1].trim() || 'info', icon: m[2], title: m[3], body: m[4] });
        }

        // Link Hub
        const linkGridRegex = /<div[^>]*class="[^"]*wf-link-hub[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
        while ((m = linkGridRegex.exec(body)) !== null) {
            const itemRegex = /<a href="([^"]+)"[^>]*><Icon icon="([^"]+)" \/><span>([^<]+)<\/span><\/a>/g;
            const links = [];
            let iM;
            while ((iM = itemRegex.exec(m[1])) !== null) links.push(`${iM[3]}|${iM[1]}|${iM[2]}`);
            addFound(m.index, m[0].length, { type: 'link-grid', links: links.join('\n') });
        }

        // Tables
        const tableRegex = /^\|.*\|$\n^\|[-| :]*\|$\n(?:^\|.*\|$\n?)+/gm;
        while ((m = tableRegex.exec(body)) !== null) {
            const lines = m[0].trim().split('\n');
            if (lines.length >= 3) {
                const headers = lines[0].split('|').slice(1, -1).map(s => s.trim()).join(', ');
                const rows = lines.slice(2).map(l => l.split('|').slice(1, -1).map(s => s.trim()).join(', ')).join('\n');
                addFound(m.index, m[0].length, { type: 'table', headers, rows });
            }
        }

        // 4. Final assembly
        found.sort((a, b) => a.index - b.index);
        const finalBlocks = [];
        let lastIdx = 0;
        found.forEach(f => {
            const gap = body.slice(lastIdx, f.index).trim();
            if (gap && gap.length > 3) {
                const cleanGap = gap.replace(/^<\/div>|<\/div>$/g, '').trim();
                if (cleanGap) finalBlocks.push({ id: nextId(), type: 'paragraph', body: cleanGap });
            }
            f.data.id = nextId();
            finalBlocks.push(f.data);
            lastIdx = f.index + f.length;
        });

        const finalGap = body.slice(lastIdx).trim().replace(/^<\/div>|<\/div>$/g, '').trim();
        if (finalGap) finalBlocks.push({ id: nextId(), type: 'paragraph', body: finalGap });

        this.blocks = finalBlocks.length > 0 ? finalBlocks : [{ id: nextId(), type: 'paragraph', body: 'No valid blocks found.' }];
    },

    addBlock(type) {
      const blk = { id: this.nextBlkId++, type, isGrid: false, color: '', link: '', image: '', cardTitle: '' };
      if (type === 'section-title') Object.assign(blk, { num: '1.0', title: 'New Section', icon: 'lucide:star' });
      else if (type === 'h2') Object.assign(blk, { title: 'Heading Title' });
      else if (type === 'h3') Object.assign(blk, { title: 'Sub-heading Title' });
      else if (type === 'paragraph') Object.assign(blk, { body: 'Write your paragraph content here.' });
      else if (type === 'card') Object.assign(blk, { 
        icon: 'lucide:info', number: '', body: 'Component text content...', 
        links: [{ text: 'Learn More', href: '#' }], overlayLabel: '', layout: 'top' 
      });
      else if (type === 'feature-grid') Object.assign(blk, { 
        title: 'Main Features', 
        items: 'lucide:zap|Fast Performance\nlucide:shield|Secure by Default\nlucide:cpu|Advanced AI' 
      });
      else if (type === 'timeline') Object.assign(blk, { 
        body: '2024|Project Started\n2025|V1 Released\n2026|Global Expansion' 
      });
      else if (type === 'image-gallery') Object.assign(blk, { 
        images: '/path/to/img1.png\n/path/to/img2.png' 
      });
      else if (type === 'video') Object.assign(blk, { platform: 'youtube', vid: 'VIDEO_ID', title: 'Trailer' });
      else if (type === 'file') Object.assign(blk, { label: 'Download Assets', url: '#', size: '1.2 MB' });
      else if (type === 'stat-grid') Object.assign(blk, { body: 'Speed|120\nPower|High\nWeight|2.4kg' });
      else if (type === 'progress') Object.assign(blk, { label: 'Experience', value: 75, max: 100, color: '' });
      else if (type === 'quote') Object.assign(blk, { author: 'Warden', body: 'The ashes speak... do you hear them?' });
      else if (type === 'compare') Object.assign(blk, { 
        leftTitle: 'Standard', rightTitle: 'Elite',
        leftIcon: 'lucide:shield', rightIcon: 'lucide:shield-check',
        body: 'Armor|10|25\nHealth|100|150\nSpeed|Slow|Moderate' 
      });
      else if (type === 'hero') Object.assign(blk, { title: 'VALORANT PROTOCOL', subtitle: 'Global covert operations unit.', badge: 'ELITE UNIT', image: '/wallpaper/backgroundwf.webp' });
      else if (type === 'skill') Object.assign(blk, { name: 'Blast Pack', type_label: 'Basic Ability', cost: '200', cd: '0', icon: 'lucide:bomb', desc: 'Instantly throw a Blast Pack that sticks to surfaces.' });
      else if (type === 'alert') Object.assign(blk, { variant: 'info', title: 'Update Notice', body: 'This system was updated to v2.4.0', icon: 'lucide:info' });
      else if (type === 'link-grid') Object.assign(blk, { links: 'Missions|/missions|lucide:target\nAgents|/agents|lucide:users\nMaps|/maps|lucide:map' });
      else if (type === 'badge') Object.assign(blk, { text: 'TAG', variant: 'normal' });
      else if (type === 'collapse') Object.assign(blk, { icon: 'lucide:chevron-right', title: 'Accordion Title', body: 'Extended content here...' });
      else if (type === 'tip') Object.assign(blk, { icon: 'lucide:lightbulb', body: 'Important tip or note.' });
      else if (type === 'image') Object.assign(blk, { src: '/path/to/image.png', alt: 'Image description', caption: '' });
      else if (type === 'link') Object.assign(blk, { text: 'Click Here', href: 'https://', external: true });
      else if (type === 'code') Object.assign(blk, { lang: 'javascript', code: '// Your code here\nconsole.log("Hello World")' });
      else if (type === 'table') Object.assign(blk, { headers: 'Column 1, Column 2, Column 3', rows: 'Value 1, Value 2, Value 3\nValue A, Value B, Value C' });
      else if (type === 'stat') Object.assign(blk, { value: '100%', label: 'Label' });
      else if (type === 'steps') Object.assign(blk, { body: 'lucide:check|Step one\nlucide:check|Step two', color: '#ff7800' });
      else if (type === 'command') Object.assign(blk, { label: 'Comanda', body: '!missions', color: '#ff7800' });
      else if (type === 'tip') Object.assign(blk, { body: 'This is a helpful tip.', qtype: 'green', icon: 'lucide:lightbulb' });
      else if (type === 'key-row') Object.assign(blk, { body: 'E|Interact\nF|Go Up\nSHIFT|Go Down' });
      else if (type === 'media-showcase') Object.assign(blk, { image: '/crates/cases_gif.gif', label: '!cases menu', caption: 'Comanda !cases' });
      else if (type === 'numbered-steps') Object.assign(blk, { body: 'Step Title|Detailed description here.\nAnother Step|More details.' });
      else if (type === 'lore-header') Object.assign(blk, { title: 'LORE TITLE', sub: 'The beginning of the legend' });
      else if (type === 'grid-start') Object.assign(blk, { cols: 2 });
      else if (type === 'grid-end') Object.assign(blk, {});
      else if (type === 'divider') Object.assign(blk, {});
      
      this.blocks.push(blk);
      this.editingBlkId = blk.id;
      this.scrollToPreview(blk.id);
    },
    
    toggleEdit(id) {
      this.editingBlkId = this.editingBlkId === id ? null : id;
    },
    
    moveBlk(idx, dir) {
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= this.blocks.length) return;
      const b = this.blocks.splice(idx, 1)[0];
      this.blocks.splice(newIdx, 0, b);
    },
    
    removeBlk(idx) {
      this.blocks.splice(idx, 1);
      if (this.editingIdx === idx) this.editingIdx = null;
    },

    cloneBlk(idx) {
       const clone = JSON.parse(JSON.stringify(this.blocks[idx]));
       clone.id = this.nextBlkId++;
       this.blocks.splice(idx + 1, 0, clone);
       this.showToast('Block duplicated', 'success', 'lucide:copy');
    },

    openIconPicker(idx, field) {
       this.iconPickerTarget = { idx, field };
       this.showIconPicker = true;
    },

    selectIcon(icon) {
       if (this.iconPickerTarget) {
          const { idx, field } = this.iconPickerTarget;
          if (idx !== null) {
            this.blocks[idx][field] = icon;
          } else {
            this.header.icon = icon;
          }
          
          // Update recents
          if (!this.recentIcons.includes(icon)) {
            this.recentIcons.unshift(icon);
            if (this.recentIcons.length > 10) this.recentIcons.pop();
            localStorage.setItem('phoenix_studio_recent_icons', JSON.stringify(this.recentIcons));
          }
          
          this.showToast(`Icon selected: ${icon.split(':')[1]}`, 'success', icon);
       }
       // We keep the picker open so user can try multiple icons
       // They can close via 'X' or clicking outside
    },

    toggleBodyScroll(disable) {
      if (typeof document === 'undefined') return;
      if (disable) document.body.classList.add('studio-modal-open');
      else document.body.classList.remove('studio-modal-open');
    },

    scrollToPreview(id) {
      setTimeout(() => {
        const el = document.querySelector(`[data-id="${id}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    },

    copyMD() {
      navigator.clipboard.writeText(this.generatedMD);
      this.copied = true;
      this.showToast('Markdown copied to clipboard!', 'success', 'lucide:check');
      setTimeout(() => { this.copied = false }, 2000);
    },
    
    downloadMD() {
      const blob = new Blob([this.generatedMD], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${this.header.pid || 'wiki-page'}.md`; a.click();
      this.showToast('File exported successfully', 'success', 'lucide:download');
    },
    
    async resetCanvas() {
      if (await this.askConfirm('CLEAR CANVAS', 'Are you sure you want to clear the canvas and start a new page? This action cannot be undone.')) {
        this.blocks = [];
        this.header = {
          title: 'New Wiki Page',
          badge: 'Category',
          icon: 'lucide:file-text',
          pid: 'new-id',
          path: 'Home, Section',
          tags: [{ text: 'DRAFT', component: 'PageTagOrange' }],
          background: '/wallpaper/backgroundwf.webp',
          blurAmount: 6
        };
        this.nextBlkId = 1;
        this.showToast('Canvas cleared', 'success', 'lucide:trash-2');
      }
    },

    renderInline(str) {
       if (!str) return '';
       return str
         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
         .replace(/\*(.*?)\*/g, '<em>$1</em>')
         .replace(/\n/g, '<br/>');
    },

    // ── UNDO / REDO ──
    snapshotState() {
      const snap = JSON.stringify({ blocks: this.blocks, header: this.header });
      // Don't push duplicate snapshots
      if (this.history.length && this.history[this.historyPointer] === snap) return;
      // Discard redo-future if we branched
      if (this.historyPointer < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyPointer + 1);
      }
      this.history.push(snap);
      if (this.history.length > 80) this.history.shift();
      this.historyPointer = this.history.length - 1;
    },

    debouncedSnapshot() {
      clearTimeout(this._snapshotTimer);
      this._snapshotTimer = setTimeout(() => this.snapshotState(), 400);
    },

    undo() {
      if (this.historyPointer <= 0) return;
      this.historyPointer--;
      this.isRestoring = true;
      const snap = JSON.parse(this.history[this.historyPointer]);
      this.blocks = snap.blocks;
      this.header = snap.header;
      this.$nextTick(() => { this.isRestoring = false; });
      this.showToast('Undo', 'info', 'lucide:undo-2');
    },

    redo() {
      if (this.historyPointer >= this.history.length - 1) return;
      this.historyPointer++;
      this.isRestoring = true;
      const snap = JSON.parse(this.history[this.historyPointer]);
      this.blocks = snap.blocks;
      this.header = snap.header;
      this.$nextTick(() => { this.isRestoring = false; });
      this.showToast('Redo', 'info', 'lucide:redo-2');
    },

    _onKeyDown(e) {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); this.undo(); }
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); this.redo(); }
      if (e.key === 's') { e.preventDefault(); this.autoSaveDraft(); }
    },

    // ── BACKUP MANAGER ──
    loadBackups() {
      try {
        const raw = localStorage.getItem('phoenix_studio_backups');
        this.backups = raw ? JSON.parse(raw) : [];
      } catch(e) { this.backups = []; }
    },

    saveBackup(name) {
      const bName = name || this.backupNameInput.trim() || `Backup ${new Date().toLocaleTimeString()}`;
      const snap = {
        id: Date.now(),
        name: bName,
        date: new Date().toISOString(),
        theme: this.activeTheme,
        blocks: JSON.parse(JSON.stringify(this.blocks)),
        header: JSON.parse(JSON.stringify(this.header))
      };
      this.backups.unshift(snap);
      if (this.backups.length > 20) this.backups = this.backups.slice(0, 20);
      localStorage.setItem('phoenix_studio_backups', JSON.stringify(this.backups));
      this.backupNameInput = '';
      this.showToast(`Backup saved: "${bName}"`, 'success', 'lucide:save');
    },

    async restoreBackup(idx) {
      const snap = this.backups[idx];
      if (!snap) return;
      if (!(await this.askConfirm('RESTORE BACKUP', `Restore "${snap.name}"? The current canvas will be permanently overwritten.`))) return;
      this.isRestoring = true;
      this.blocks = JSON.parse(JSON.stringify(snap.blocks));
      this.header = JSON.parse(JSON.stringify(snap.header));
      if (snap.theme) this.activeTheme = snap.theme;
      this.nextBlkId = Math.max(...this.blocks.map(b => b.id || 0), 0) + 1;
      this.$nextTick(() => { this.isRestoring = false; this.snapshotState(); });
      this.showBackups = false;
      this.showToast(`Restored: "${snap.name}"`, 'success', 'lucide:clock-rewind');
    },

    deleteBackup(idx) {
      this.backups.splice(idx, 1);
      localStorage.setItem('phoenix_studio_backups', JSON.stringify(this.backups));
      this.showToast('Backup deleted', 'info', 'lucide:trash-2');
    },

    autoSaveDraft() {
      this.isSaving = true;
      const draft = JSON.stringify({ blocks: this.blocks, header: this.header, theme: this.activeTheme });
      localStorage.setItem('phoenix_studio_draft', draft);
      this.lastSaved = new Date();
      setTimeout(() => { this.isSaving = false; }, 800);
    },

    formatLastSaved() {
      if (!this.lastSaved) return 'Not saved yet';
      const diff = Math.round((Date.now() - this.lastSaved.getTime()) / 1000);
      if (diff < 60) return `Saved ${diff}s ago`;
      if (diff < 3600) return `Saved ${Math.round(diff/60)}m ago`;
      return `Saved at ${this.lastSaved.toLocaleTimeString()}`;
    }
  },

  mounted() {
    if (this.githubToken || localStorage.getItem('github_token')) this.fetchFileTree();
    
    // Load recents
    const recents = localStorage.getItem('phoenix_studio_recent_icons');
    if (recents) {
      try { this.recentIcons = JSON.parse(recents); } catch(e) {}
    }

    // Load draft
    const draft = localStorage.getItem('phoenix_studio_draft');
    if (draft) {
       try {
          const parsed = JSON.parse(draft);
          this.blocks = parsed.blocks || this.blocks;
          this.header = parsed.header || this.header;
          this.nextBlkId = Math.max(...this.blocks.map(b => b.id), 0) + 1;
       } catch(e) {}
    }

    // Keyboard shortcuts
    this._keyHandler = this._onKeyDown.bind(this);
    document.addEventListener('keydown', this._keyHandler);

    // Load backups
    this.loadBackups();

    // Auto-save every 3 minutes
    this.autoSaveTimer = setInterval(() => this.autoSaveDraft(), 3 * 60 * 1000);

    // Initial snapshot
    this.$nextTick(() => this.snapshotState());
  },

  beforeUnmount() {
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);
    if (this._snapshotTimer) clearTimeout(this._snapshotTimer);
  }
})

const blkRenderers = {
  'section-title': b => {
    const style = b.gradient ? ` style="background: linear-gradient(135deg, ${b.color || 'var(--vp-c-brand-1)'}, var(--vp-c-brand-3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;"` : (b.color ? ` style="color: ${b.color};"` : '');
    return `<div class="wf-info-title">\n  <Icon icon="${b.icon}"${b.color ? ` style="color: ${b.color};"` : ''}></Icon>\n  <div class="wf-info-number"${b.color ? ` style="background: ${b.color}; color: #fff;"` : ''}>${b.num}</div>\n  <span${style}>${b.title}</span>\n</div>`;
  },
  'h2': b => `## ${b.title}${b.link ? ` {#${b.link}}` : ''}${b.color ? ` <span style="color: ${b.color};"></span>` : ''}`,
  'h3': b => `### ${b.title}${b.link ? ` {#${b.link}}` : ''}${b.color ? ` <span style="color: ${b.color};"></span>` : ''}`,
  'paragraph': b => b.body,
  'card': b => {
    const gridStyle = b.isGrid ? ' width: calc(50% - 10px); display: inline-block; vertical-align: top; margin: 5px;' : '';
    const colorStyle = b.color ? ` border-left: 3px solid ${b.color};` : '';
    return `<div class="wf-info-card ${b.layout || 'top'}" style="${gridStyle}${colorStyle}">\n  ${b.image ? `<div class="wf-info-card-media"><img src="${b.image}" />${b.overlayLabel ? `<div class="card-overlay-badge">${b.overlayLabel}</div>` : ''}</div>` : ''}\n  <div class="wf-info-icon"><Icon icon="${b.icon || 'lucide:info'}" /></div>\n  <div class="wf-info-content">\n    ${b.number ? `<div class="wf-info-number">${b.number}</div>` : ''}\n    ${b.cardTitle ? `<div class="card-title">${b.cardTitle}</div>` : ''}\n    <div class="card-text">${b.body || ''}</div>\n  </div>\n</div>`;
  },
  'numbered-steps': b => {
    const steps = (b.body || '').split('\n').filter(s => s.trim()).map((line, i) => {
      return `  <div class="wf-step-item">\n    <div class="step-num">${i+1}</div>\n    <div class="step-text">${line.trim()}</div>\n  </div>`;
    }).join('\n');
    return `<div class="wf-numbered-steps" style="--accent: ${b.color || 'var(--vp-c-brand-1)'}">\n${steps}\n</div>`;
  },
  'lore-header': b => `<div class="wf-lore-header" style="--accent: ${b.color || 'var(--vp-c-brand-1)'}">\n  <div class="lore-sub">${b.sub}</div>\n  <h2 class="lore-title">${b.title}</h2>\n  <div class="lore-divider"></div>\n</div>`,
  'grid-start': b => `<div class="wf-info-grid" style="grid-template-columns: repeat(${b.cols || 2}, 1fr);">`,
  'grid-end': () => `</div><!-- grid-end -->`,
  'feature-grid': b => {
    const items = (b.items || '').split('\n').filter(s => s.includes('|')).map(line => {
      const [icon, text] = line.split('|');
      return `    <div class="feature-item"><Icon icon="${icon.trim()}" /><span>${text.trim()}</span></div>`;
    }).join('\n');
    return `<div class="wf-feature-grid">\n  <div class="feature-header">${b.title}</div>\n  <div class="feature-items">\n${items}\n  </div>\n</div>`;
  },
  'timeline': b => {
    const items = (b.body || '').split('\n').filter(s => s.includes('|')).map(line => {
      const [date, text] = line.split('|');
      return `  <div class="timeline-point">\n    <div class="point-marker"></div>\n    <div class="point-content"><strong>${date.trim()}</strong><span>${text.trim()}</span></div>\n  </div>`;
    }).join('\n');
    return `<div class="wf-timeline">\n${items}\n</div>`;
  },
  'stat-grid': b => {
    const items = (b.body || '').split('\n').filter(s => s.includes('|')).map(line => {
      const [label, val] = line.split('|');
      return `  <div class="kv-item"><span class="kv-key">${label}</span><span class="kv-val">${val}</span></div>`;
    }).join('\n');
    return `<div class="wf-stat-grid">\n${items}\n</div>`;
  },
  'progress': b => {
    const pct = Math.round((b.value / b.max) * 100);
    return `<div class="wf-progress-wrap">\n  <div class="progress-labels"><span>${b.label}</span><span>${pct}%</span></div>\n  <div class="progress-track"><div class="progress-bar" style="width: ${pct}%; background: ${b.color || 'var(--vp-c-brand-1)'}"></div></div>\n</div>`;
  },
  'quote': b => `<blockquote class="wf-lore-quote">\n  <p>${b.body}</p>\n  ${b.author ? `<cite>— ${b.author}</cite>` : ''}\n</blockquote>`,
  'compare': b => {
    const rows = (b.body || '').split('\n').filter(s => s.includes('|')).map(line => {
      const [label, l, r] = line.split('|');
      return `      <tr><td>${label}</td><td>${l}</td><td>${r}</td></tr>`;
    }).join('\n');
    return `<div class="wf-compare-block">\n  <div class="compare-header">\n    <div class="compare-side left"><Icon icon="${b.leftIcon}" /><span>${b.leftTitle}</span></div>\n    <div class="compare-vs">VS</div>\n    <div class="compare-side right"><Icon icon="${b.rightIcon}" /><span>${b.rightTitle}</span></div>\n  </div>\n  <table>\n${rows}\n  </table>\n</div>`;
  },
  'image-gallery': b => {
    const imgs = (b.images || '').split('\n').filter(s => s.trim()).map(src => {
      return `    <div class="gallery-item"><img src="${src.trim()}" /></div>`;
    }).join('\n');
    return `<div class="wf-image-gallery">\n${imgs}\n</div>`;
  },
  'badge': b => `<span class="wf-info-${b.variant === 'normal' ? 'badge' : b.variant}">${b.text}</span>`,
  'hero': b => `<div class="wf-hero-section" style="background-image: url(${b.image})">\n  <div class="hero-overlay"></div>\n  <div class="hero-content">\n    <div class="hero-badge" style="color: ${b.color || 'var(--vp-c-brand-1)'}">${b.badge}</div>\n    <h1>${b.title}</h1>\n    <p>${b.subtitle}</p>\n  </div>\n</div>`,
  'skill': b => `<div class="wf-skill-card">\n  <div class="skill-header">\n    <Icon icon="${b.icon}" class="skill-icon" style="color: ${b.color || 'var(--vp-c-brand-1)'}" />\n    <div class="skill-meta">\n      <span class="skill-name">${b.name}</span>\n      <span class="skill-type">${b.type_label}</span>\n    </div>\n  </div>\n  <div class="skill-stats">\n${b.cost ? `    <div class="skill-stat"><span>Cost</span><span>${b.cost}</span></div>\n` : ''}${b.cd ? `    <div class="skill-stat"><span>CD</span><span>${b.cd}${b.cd.toString().endsWith('s') ? '' : 's'}</span></div>\n` : ''}${(b.stats || '').split('\n').filter(s => s.includes('|')).map(s => `    <div class="skill-stat"><span>${s.split('|')[0]}</span><span>${s.split('|')[1]}</span></div>`).join('\n')}\n  </div>\n  <p class="skill-desc">${b.desc}</p>\n</div>`,
  'alert': b => `<div class="wf-status-alert ${b.variant}">\n  <Icon icon="${b.variant === 'error' ? 'lucide:alert-octagon' : b.variant === 'warning' ? 'lucide:alert-triangle' : 'lucide:info'}" />\n  <div class="alert-body">\n    <span class="alert-title">${b.title}</span>\n    <p>${b.body}</p>\n  </div>\n</div>`,
  'link-grid': b => {
    const links = (b.links || '').split('\n').filter(s => s.includes('|')).map(line => {
      const [icon, label] = line.split('|');
      return `    <div class="link-item"><Icon icon="${icon.trim() || 'lucide:link'}" /><span>${label.trim()}</span></div>`;
    }).join('\n');
    return `<div class="wf-link-hub">\n${links}\n</div>`;
  },
  'tip': b => `<div class="wf-system-tip ${b.variant || 'orange'}">\n  <Icon icon="${b.icon || 'lucide:lightbulb'}" />\n  <span>${b.body}</span>\n</div>`,
  'key-row': b => `<div class="wf-system-key-row">\n${(b.body || '').split('\n').filter(s => s.includes('|')).map(l => {
    const [key, val] = l.split('|');
    return `  <div class="wf-system-key-item"><span class="wf-system-key-button">${key || '?'}</span><span>${val || ''}</span></div>`;
  }).join('\n')}\n</div>`,
  'media-showcase': b => `<div class="media-showcase-wrap">\n  <div class="media-container">\n    <img src="${b.image}" loading="lazy">\n    <div class="media-badge">${b.label}</div>\n  </div>\n  <div class="media-caption">${b.caption}</div>\n</div>`,
  'collapse': b => `<div class="wf-info-collapse">\n  <div class="wf-info-collapse-header active">\n    <div class="wf-info-collapse-icon"><Icon icon="${b.icon}" width="20"></Icon></div>\n    <div class="wf-info-collapse-title">${b.title}</div>\n  </div>\n  <div class="wf-info-collapse-content">${b.body}</div>\n</div>`,
  'image': b => `![${b.alt || 'image'}](${b.src})${b.caption ? `\n*${b.caption}*` : ''}`,
  'link': b => `[${b.text}](${b.href})${b.external ? ' (opens in new tab)' : ''}`,
  'code': b => `\`\`\`${b.lang}\n${b.code}\n\`\`\``,
  'table': b => {
    const headers = (b.headers || '').split(',').map(h => h.trim());
    const rows = (b.rows || '').split('\n').map(r => r.split(',').map(c => c.trim()));
    const sep = headers.map(() => '---').join(' | ');
    return `| ${headers.join(' | ')} |\n| ${sep} |\n${rows.map(r => `| ${r.join(' | ')} |`).join('\n')}`;
  },
  'stat': b => `<div class="wf-info-stat-item">\n  <div class="wf-info-stat-number">${b.value}</div>\n  <div class="wf-info-stat-label">${b.label}</div>\n</div>`,
  'steps': b => `<ul class="wf-system-custom-list">\n${(b.body || '').split('\n').filter(s => s.includes('|')).map(item => `  <li><Icon icon="${item.split('|')[0].trim()}"${b.color ? ` style="color: ${b.color}"` : ''} /><span>${item.split('|')[1].trim()}</span></li>`).join('\n')}\n</ul>`,
  'command': b => `<div class="canvas-command-preview">\n  <span class="label">${b.label}</span>\n  <code style="background: ${b.color ? b.color + '11' : 'var(--vp-c-brand-soft)'}; color: ${b.color || 'var(--vp-c-brand-1)'}">${b.body}</code>\n</div>`,
  'divider': () => `<div class="wf-info-divider"></div>`
};
</script>

<style scoped>
.panel-generator {
  --studio-bg: #0a0a0c;
  --studio-sidebar: rgba(16, 16, 20, 0.4);
  --studio-border: rgba(255,255,255,0.08);
  --studio-text: #e2e8f0;
  --studio-muted: #8a8a95;
  --accent: #ff7800;
  --glass: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-glow: rgba(var(--accent-rgb), 0.15);
  
  display: flex; flex-direction: column; height: calc(100vh - 140px); background: var(--studio-bg);
  border-radius: 32px; overflow: hidden; border: 1px solid var(--studio-border);
  box-shadow: 0 40px 100px rgba(0,0,0,0.6);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-optical-sizing: auto;
  font-feature-settings: "cv02", "cv05", "cv11", "ss01";
  transform: translateZ(0);
  position: relative;
  z-index: 1;
}

:global(body.studio-modal-open) { overflow: hidden !important; }

.panel-generator :deep(.cs2-bg) {
  position: absolute; inset: 0; z-index: -1; pointer-events: none; opacity: 0.6;
}

/* ── Top Bar ── */
.pg-topbar {
  padding: 10px 16px; border-bottom: 1px solid var(--studio-border);
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(10, 10, 12, 0.85); z-index: 100;
}
.pg-logo-section { display: flex; align-items: center; gap: 4px; }
.pg-logo-orb-wrap { 
  width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; margin-right: -10px;
}
.pg-logo-orb-wrap :deep(canvas) { width: 70px !important; height: 70px !important; }

.pg-logo-text { display: flex; flex-direction: column; line-height: 1; }
.pg-brand { font-size: 20px; font-weight: 700; letter-spacing: 3px; color: #fff; text-shadow: none; }
.pg-app { font-size: 10px; color: var(--accent); font-weight: 600; text-transform: uppercase; margin-top: 2px; letter-spacing: 2px; }

.pg-actions { display: flex; align-items: center; gap: 8px; }
.pg-theme-palette {
  display: flex; gap: 4px; background: var(--glass); padding: 3px; border-radius: 12px; border: 1px solid var(--glass-border);
}
.theme-swatch {
  display: flex; align-items: center; gap: 5px; padding: 5px 8px; border-radius: 8px;
  background: transparent; border: 1px solid transparent; color: var(--studio-muted);
  cursor: pointer; transition: 0.3s; font-size: 10px; font-weight: 800; text-transform: uppercase;
}
.theme-swatch:hover { background: rgba(255,255,255,0.05); color: #fff; }
.theme-swatch.active { background: rgba(var(--accent-rgb), 0.15); border-color: rgba(var(--accent-rgb), 0.3); color: #fff; box-shadow: 0 0 15px rgba(var(--accent-rgb), 0.2); }
.swatch-orb { width: 8px; height: 8px; border-radius: 50%; background: var(--tc); box-shadow: 0 0 10px var(--tc); }
.swatch-check { margin-left: 2px; color: var(--tc); }

.pg-action-btn {
  background: var(--glass); border: 1px solid var(--glass-border); color: #fff;
  padding: 0 10px; height: 32px; border-radius: 8px; font-size: 10px; font-weight: 800; 
  cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  white-space: nowrap; text-transform: uppercase; letter-spacing: 0.5px;
}
.pg-action-btn:hover { 
  background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); 
  transform: translateY(-1px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); 
}
.pg-action-btn.export { 
  border-color: rgba(var(--accent-rgb), 0.5); color: var(--accent); 
  background: rgba(var(--accent-rgb), 0.1); 
}
.pg-action-btn.export:hover { 
  background: var(--accent); color: #000; 
  box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.4); 
}

.v-sep { width: 1px; height: 20px; background: var(--studio-border); margin: 0 4px; }

/* ── Main Layout ── */
.pg-main-layout { display: grid; grid-template-columns: 360px 1fr; flex: 1; min-height: 0; position: relative; }

/* ── Sidebar ── */
.pg-editor-sidebar { 
  border-right: 1px solid var(--studio-border); display: flex; flex-direction: column; 
  background: rgba(10, 10, 12, 0.4); 
  position: relative; overflow: hidden; backdrop-filter: blur(20px);
}
.pg-sidebar-head { 
  padding: 16px 24px; font-size: 11px; font-weight: 600; color: #fff; letter-spacing: 1.5px; display: flex; align-items: center; gap: 12px; 
  border-bottom: 1px solid var(--studio-border); background: rgba(255,255,255,0.03); z-index: 5;
  backdrop-filter: blur(10px);
}
.pg-sidebar-scroll { 
  flex: 1; overflow-y: auto; overflow-x: hidden; padding: 16px; display: flex; flex-direction: column; gap: 16px; 
  scrollbar-width: thin; scrollbar-color: var(--studio-border) transparent;
  scroll-behavior: smooth; min-height: 0;
}
.pg-sidebar-scroll::-webkit-scrollbar { width: 4px; }
.pg-sidebar-scroll::-webkit-scrollbar-thumb { background: var(--studio-border); border-radius: 10px; }
.pg-sidebar-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent); }

.pg-config-group { display: flex; flex-direction: column; width: 100%; min-width: 0; margin-bottom: 8px; }
.group-hd { 
  padding: 12px 16px; font-size: 11px; font-weight: 900; color: #fff; display: flex; justify-content: space-between; align-items: center; 
  cursor: pointer; transition: 0.3s; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(5px);
}
.group-hd:hover { color: var(--accent); background: rgba(var(--accent-rgb), 0.08); border-color: rgba(var(--accent-rgb), 0.2); }
.group-hd-left { display: flex; align-items: center; gap: 10px; }
.group-content { padding: 16px 8px 8px; display: flex; flex-direction: column; gap: 16px; width: 100%; }

.studio-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; width: 100%; }
.studio-field label { font-size: 10px; font-weight: 600; color: var(--studio-muted); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 2px; }
.studio-field input, .studio-field textarea, .studio-field select {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
  padding: 10px 14px; font-size: 12px; color: #fff; outline: none; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%; box-sizing: border-box; min-width: 0; backdrop-filter: blur(5px);
}
.studio-field input:focus, .studio-field textarea:focus { border-color: var(--accent); background: rgba(var(--accent-rgb), 0.08); box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.2); }
.studio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; min-width: 0; }
.studio-grid > * { min-width: 0; }


/* ── Sidebar Add Block ── */
.pg-sidebar-head { 
  padding: 16px 24px; font-size: 11px; font-weight: 700; color: #fff; letter-spacing: 1.5px; display: flex; align-items: center; gap: 12px; 
  border-bottom: 1px solid var(--studio-border); background: rgba(255,255,255,0.03); z-index: 5; flex-shrink: 0;
  backdrop-filter: blur(10px);
}
.sidebar-add-btn {
  margin-left: auto; display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  color: var(--studio-muted); padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800;
  cursor: pointer; transition: 0.2s; letter-spacing: 1px; white-space: nowrap;
}
.sidebar-add-btn:hover, .sidebar-add-btn.open { background: var(--accent); color: #000; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }

.sidebar-add-dropdown {
  border-bottom: 1px solid var(--studio-border); background: rgba(0,0,0,0.8); padding: 20px;
  display: flex; flex-direction: column; gap: 12px; backdrop-filter: blur(30px);
  animation: dropIn 0.2s ease; flex-shrink: 0;
  max-height: 50vh; overflow-y: auto; z-index: 10;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.sidebar-add-dropdown::-webkit-scrollbar { width: 4px; }
.sidebar-add-dropdown::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }
@keyframes dropIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

.add-group-label { font-size: 9px; font-weight: 900; color: var(--studio-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
.add-group-items { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
.add-item-btn {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; font-size: 11px;
  font-weight: 700; color: #ccc; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  cursor: pointer; transition: 0.15s; white-space: nowrap; overflow: hidden;
}
.add-item-btn:hover { background: rgba(var(--accent-rgb), 0.12); color: var(--accent); border-color: rgba(var(--accent-rgb), 0.3); }

.studio-add-btn { 
  width: 100%; padding: 16px; border-radius: 14px; border: 1px dashed rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); 
  color: var(--studio-muted); font-size: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; 
  display: flex; align-items: center; justify-content: center; gap: 12px; backdrop-filter: blur(5px);
}
.studio-add-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(var(--accent-rgb), 0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.3); transform: translateY(-2px); }

/* ── New Canvas Block Types ── */
.canvas-h2 {
  font-size: 1.7rem; font-weight: 700; color: #fff; margin: 32px 0 12px;
  padding-bottom: 10px; border-bottom: 1px solid var(--studio-border); letter-spacing: -0.5px;
}
.canvas-h3 {
  font-size: 1.25rem; font-weight: 600; color: rgba(255,255,255,0.85); margin: 24px 0 10px; letter-spacing: -0.3px;
}
.canvas-paragraph { font-size: 15px; line-height: 1.8; color: rgba(255,255,255,0.7); margin-bottom: 20px; }

.canvas-image-block { margin-bottom: 28px; }
.canvas-image-block img { max-width: 100%; border-radius: 12px; border: 1px solid var(--studio-border); display: block; }
.canvas-img-placeholder { 
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  padding: 40px; border-radius: 12px; border: 2px dashed var(--studio-border); color: var(--studio-muted);
  font-size: 12px; background: rgba(255,255,255,0.02);
}
.canvas-img-caption { font-size: 12px; color: var(--studio-muted); font-style: italic; text-align: center; margin-top: 8px; }

.canvas-link-block { margin-bottom: 20px; }
.canvas-link-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px;
  background: rgba(var(--accent-rgb), 0.1); border: 1px solid rgba(var(--accent-rgb), 0.3);
  color: var(--accent); font-size: 13px; font-weight: 700; text-decoration: none; transition: 0.2s;
}
.canvas-link-btn:hover { background: var(--accent); color: #000; }

/* ── Tip & Key Styles ── */
.wf-system-tip {
  padding: 18px 24px; border-radius: 16px; display: flex; gap: 20px; align-items: center;
  margin: 24px 0; background: rgba(0, 200, 81, 0.05); border: 1px solid rgba(0, 200, 81, 0.2); color: #00c851;
}
.wf-system-tip.orange { background: rgba(255, 140, 0, 0.05); border: 1px solid rgba(255, 140, 0, 0.2); color: #ff8c00; }
.wf-system-tip span { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85); }

.wf-system-key-row { display: flex; flex-direction: column; gap: 8px; margin: 20px 0; }
.wf-system-key-item { display: flex; align-items: center; gap: 14px; font-size: 14px; color: rgba(255,255,255,0.7); }
.wf-system-key-button {
  background: #1a1a20; border: 1px solid rgba(255,255,255,0.1); border-bottom-width: 3px;
  padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; color: var(--accent);
  min-width: 34px; text-align: center; font-family: 'Orbitron', sans-serif;
}

.canvas-code-block { margin-bottom: 28px; border-radius: 12px; overflow: hidden; border: 1px solid var(--studio-border); }
.canvas-code-header { 
  display: flex; align-items: center; justify-content: space-between; padding: 10px 16px;
  background: rgba(255,255,255,0.04); border-bottom: 1px solid var(--studio-border);
}
.canvas-code-lang { font-size: 10px; font-weight: 800; color: var(--accent); letter-spacing: 1px; text-transform: uppercase; }
.canvas-code-block pre { margin: 0; padding: 20px; background: #050507; overflow-x: auto; }
.canvas-code-block code { font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7; color: #a0aec0; }

.canvas-table-block { margin-bottom: 28px; overflow-x: auto; }
.canvas-table-block table { width: 100%; border-collapse: collapse; font-size: 13px; }
.canvas-table-block th { padding: 10px 16px; background: rgba(var(--accent-rgb), 0.08); border: 1px solid var(--studio-border); color: var(--accent); font-weight: 800; text-align: left; font-size: 11px; letter-spacing: 0.5px; }
.canvas-table-block td { padding: 10px 16px; border: 1px solid var(--studio-border); color: rgba(255,255,255,0.7); }

/* ── New Block Styles ── */
.wf-feature-grid { margin: 30px 0; }
.feature-grid-title { font-size: 11px; font-weight: 900; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px; opacity: 0.8; }
.feature-grid-items { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
.feature-item { 
  background: rgba(255,255,255,0.03); border: 1px solid var(--studio-border); border-radius: 14px; padding: 20px; 
  display: flex; flex-direction: column; gap: 12px; transition: 0.3s;
}
.feature-item:hover { transform: translateY(-5px); background: rgba(var(--accent-rgb), 0.05); border-color: rgba(var(--accent-rgb), 0.3); }
.feature-item :deep(svg) { color: var(--accent); width: 24px; height: 24px; }
.feature-item span { font-size: 14px; font-weight: 700; color: #fff; }

.wf-timeline { margin: 40px 0; position: relative; padding-left: 30px; border-left: 2px solid var(--studio-border); }
.timeline-step { position: relative; margin-bottom: 30px; }
.timeline-step::before { 
  content: ''; position: absolute; left: -37px; top: 0; width: 12px; height: 12px; 
  border-radius: 50%; background: var(--accent); box-shadow: 0 0 15px var(--accent-glow);
}
.timeline-date { font-size: 11px; font-weight: 900; color: var(--accent); letter-spacing: 1px; margin-bottom: 4px; }
.timeline-content { font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.6; }

.wf-image-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; margin: 30px 0; }
.gallery-item { border-radius: 12px; overflow: hidden; border: 1px solid var(--studio-border); position: relative; aspect-ratio: 16/9; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.gallery-item:hover img { transform: scale(1.08); }

.wf-info-card.side-layout { display: flex; flex-direction: row; align-items: stretch; gap: 0; min-height: 180px; }
.wf-info-card.side-layout .wf-info-card-media { width: 40%; margin: 0; border-radius: 20px 0 0 20px; border-bottom: none; border-right: 1px solid var(--studio-border); }
.wf-info-card.side-layout .wf-info-card-media img { height: 100%; }
.wf-info-card.side-layout .wf-info-icon { top: 20px; left: auto; right: -20px; }
.studio-block-card { 
  border: 1px solid var(--studio-border); border-radius: 12px; overflow: hidden;
  background: rgba(255,255,255,0.03); transition: all 0.25s ease;
  margin-bottom: 8px; backdrop-filter: blur(10px);
}
.studio-block-card:hover { border-color: rgba(var(--accent-rgb), 0.3); background: rgba(var(--accent-rgb), 0.05); }
.studio-block-card.active { border-color: var(--accent); background: rgba(var(--accent-rgb), 0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }

.block-hd { 
  padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;
  min-height: 52px;
}
.block-hd:hover { background: rgba(255,255,255,0.02); }

.block-hd-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }

.block-type-chip {
  width: 30px; height: 30px; border-radius: 8px; border: 1px solid;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.block-label-stack { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.blk-type-label { font-size: 11px; font-weight: 700; color: #fff; letter-spacing: 0.5px; }
.blk-preview-text { font-size: 10px; color: var(--studio-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }

.block-controls { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.blk-ctrl-btn {
  width: 26px; height: 26px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.03); color: var(--studio-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: 0.15s;
}
.blk-ctrl-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.15); }
.blk-ctrl-btn:disabled { opacity: 0.25; cursor: not-allowed; }
.blk-ctrl-btn.danger:hover { background: rgba(239,68,68,0.15); color: #ef4444; border-color: rgba(239,68,68,0.3); }
.blk-expand-arrow { color: var(--studio-muted); margin-left: 4px; flex-shrink: 0; }

.block-body { padding: 16px; border-top: 1px solid var(--studio-border); background: rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 14px; }

.studio-add-btn { 
  width: 100%; padding: 16px; border-radius: 14px; border: 1px dashed var(--studio-border); background: rgba(255,255,255,0.01); color: var(--studio-muted); font-size: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 12px; 
}
.studio-add-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); box-shadow: 0 0 25px var(--accent-glow); transform: translateY(-2px); }

.studio-add-menu { 
  background: rgba(26, 26, 33, 0.95); border: 1px solid var(--studio-border); border-radius: 16px; padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); backdrop-filter: blur(20px); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative; z-index: 50;
}
@keyframes popIn { from { transform: scale(0.9) translateY(-10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
.studio-add-menu button { text-align: left; background: none; border: none; padding: 12px 15px; font-size: 11px; font-weight: 700; color: #fff; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.2s; }
.studio-add-menu button:hover { background: rgba(var(--accent-rgb), 0.15); color: var(--accent); transform: scale(1.05); }

/* ── Preview Area ── */
.pg-preview-container { display: flex; flex-direction: column; background: #050507; position: relative; overflow: hidden; }
.preview-tabs { padding: 0 30px; border-bottom: 1px solid var(--studio-border); display: flex; align-items: center; justify-content: space-between; height: 60px; background: rgba(10, 10, 12, 0.5); backdrop-filter: blur(10px); }
.tabs-list { display: flex; gap: 30px; height: 100%; }
.tabs-list button { background: none; border: none; font-size: 12px; font-weight: 700; color: var(--studio-muted); cursor: pointer; display: flex; align-items: center; gap: 12px; height: 100%; position: relative; transition: 0.3s; letter-spacing: 1.5px; }
.tabs-list button.active { color: #fff; }
.tabs-list button.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--accent); box-shadow: 0 0 20px var(--accent); border-radius: 3px 3px 0 0; }

.live-indicator { display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 900; color: var(--accent); letter-spacing: 1.5px; padding: 6px 14px; background: var(--accent-dim); border-radius: 30px; border: 1px solid var(--accent-glow); }
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: glowPulse 2s infinite; }
@keyframes glowPulse { 0% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0.4); } 70% { box-shadow: 0 0 0 10px rgba(var(--accent-rgb), 0); } 100% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0); } }

.preview-viewport { flex: 1; overflow-y: auto; padding: 100px 60px; scroll-behavior: smooth; background: radial-gradient(circle at top center, rgba(var(--accent-rgb), 0.05) 0%, transparent 80%); }
.canvas-render { max-width: 1000px; margin: 0 auto; min-height: 100%; }
.canvas-blocks { display: flex; flex-wrap: wrap; gap: 0; margin-top: 60px; }

.canvas-blk-wrap { margin-bottom: 40px; position: relative; cursor: pointer; transition: 0.4s; width: 100%; border-radius: 20px; }
.canvas-blk-wrap.grid-item { width: calc(50% - 15px); margin-right: 15px; }
.canvas-blk-wrap:hover::before { content: ''; position: absolute; inset: -20px; border: 1px dashed rgba(255,255,255,0.15); border-radius: 24px; pointer-events: none; }
.canvas-blk-wrap.is-editing::after { 
  content: ''; position: absolute; inset: -20px; border: 2px solid var(--accent); border-radius: 24px; 
  pointer-events: none; box-shadow: 0 0 40px var(--accent-glow), inset 0 0 20px var(--accent-dim); z-index: 1; 
  animation: selectionPulse 2s infinite ease-in-out;
}
@keyframes selectionPulse { 0% { opacity: 0.8; } 50% { opacity: 1; box-shadow: 0 0 60px var(--accent-glow), inset 0 0 30px var(--accent-dim); } 100% { opacity: 0.8; } }

.blk-overlay { position: absolute; top: -45px; left: 0; background: var(--accent); color: #000; font-size: 10px; font-weight: 900; padding: 6px 14px; border-radius: 10px; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 25px var(--accent-glow); z-index: 10; }

/* ── Code Mode ── */
.code-render { max-width: 1000px; margin: 0 auto; padding: 40px; }
.code-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; background: #16161c; border: 1px solid var(--studio-border); border-bottom: none; border-radius: 20px 20px 0 0; }
.code-header span { font-size: 12px; font-weight: 900; color: var(--studio-muted); letter-spacing: 2px; }
.code-header button { background: var(--accent-dim); border: 1px solid var(--accent); color: var(--accent); font-size: 11px; font-weight: 800; padding: 8px 16px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
.code-header button:hover { background: var(--accent); color: #000; }
.code-render pre { padding: 40px; background: #0a0a0e; border: 1px solid var(--studio-border); border-radius: 0 0 20px 20px; font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.8; color: #a0aec0; overflow-x: auto; }

/* ── CaseHeader Preview Fix ── */
.canvas-header-preview { margin-bottom: 60px; position: relative; }
.wch-root { position: relative; z-index: 1; }
.wch-grid-bg, .wch-ambient-glow { position: absolute; top: -60px; left: 50%; width: 100vw; height: 400px; z-index: -1; pointer-events: none; }
.wch-grid-bg {
  background-image:
    radial-gradient(circle at 1px 1px, rgba(var(--wf-accent-rgb), 0.3) 1px, transparent 1px),
    linear-gradient(to right, rgba(var(--wf-accent-rgb), 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(var(--wf-accent-rgb), 0.05) 1px, transparent 1px);
  background-size: 40px 40px, 40px 40px, 40px 40px;
  background-position: 50% 0%;
  transform: translateX(-50%) skewY(-2deg);
  mask-image: radial-gradient(ellipse 60vw 300px at 50% 0%, black 30%, transparent 80%);
}
.wch-ambient-glow {
  transform: translateX(-50%);
  background: radial-gradient(ellipse 50vw 250px at 50% 0%, rgba(var(--wf-accent-rgb), 0.1) 0%, transparent 70%);
  animation: wch-ambient-pulse 4s ease-in-out infinite alternate;
}
@keyframes wch-ambient-pulse { from { opacity: 0.5; } to { opacity: 1; } }

.wch-inner { padding: 0; }
.wch-breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; }
.wch-crumb { font-size: 11px; font-weight: 600; color: var(--studio-muted); }
.wch-crumb--active { color: #fff; }
.wch-crumb-arrow { opacity: 0.3; }

.wch-title {
  font-family: 'Orbitron', sans-serif !important;
  font-size: 2.2rem !important;
  font-weight: 700 !important;
  color: var(--vp-c-brand-1) !important;
  margin: 0 0 20px !important;
  line-height: 1.1 !important;
  letter-spacing: -1px !important;
  text-shadow: 0 0 30px rgba(var(--wf-accent-rgb), 0.2);
}

.wch-tags { display: flex; gap: 8px; margin-bottom: 24px; }
.wch-toolbar { display: flex; gap: 10px; margin-bottom: 24px; }
.wch-btn {
  display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 8px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--studio-border);
  font-size: 11px; font-weight: 700; color: var(--studio-muted);
}
.wch-meta { display: flex; align-items: center; gap: 16px; padding-top: 20px; border-top: 1px solid var(--studio-border); }
.wch-meta-chip { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--studio-muted); }

/* ── Explorer ── */
.studio-overlay { 
  position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 100000; 
  display: flex; align-items: center; justify-content: center; padding: 40px; 
  overflow: hidden; backdrop-filter: blur(20px);
}
.studio-modal { 
  background: rgba(12, 12, 16, 0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 40px; overflow: hidden; 
  box-shadow: 0 60px 180px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.22); 
  width: 100%; max-width: 1300px; height: 85vh; display: flex; flex-direction: column;
  backdrop-filter: blur(56px) saturate(180%);
  position: relative;
}

.modal-head { padding: 30px 40px; border-bottom: 1px solid var(--studio-border); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); }
.modal-title { display: flex; align-items: center; gap: 20px; }
.title-icon-orb { width: 52px; height: 52px; border-radius: 18px; background: var(--accent-dim); border: 1px solid var(--accent); display: flex; align-items: center; justify-content: center; color: var(--accent); box-shadow: 0 0 25px var(--accent-glow); }
.title-text { display: flex; flex-direction: column; }
.main-t { font-size: 18px; font-weight: 700; letter-spacing: 3px; color: #fff; font-family: 'Orbitron', sans-serif; }
.sub-t { font-size: 11px; color: var(--studio-muted); font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px; }
.modal-close { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-close:hover { background: #ef4444; color: #fff; transform: rotate(90deg); }

.explorer-body { flex: 1; display: grid; grid-template-columns: 360px 1fr; min-height: 0; }
.explorer-sidebar { border-right: 1px solid var(--studio-border); display: flex; flex-direction: column; background: rgba(0,0,0,0.3); min-height: 0; }
.explorer-search-box { padding: 24px; border-bottom: 1px solid var(--studio-border); display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.3); }
.explorer-search-box input { flex: 1; background: none; border: none; color: #fff; font-size: 14px; outline: none; }

.explorer-tree-view { flex: 1; overflow-y: auto; padding: 20px 0; }
.tree-section { margin-bottom: 24px; }
.section-hd { padding: 10px 30px; font-size: 10px; font-weight: 900; color: var(--accent); text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; gap: 12px; }
.section-hd .count { margin-left: auto; background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 20px; color: var(--studio-muted); font-size: 9px; }

.tree-file { 
  padding: 10px 30px 10px 40px; font-size: 13px; color: #a0aec0; display: flex; align-items: center; gap: 14px; 
  cursor: pointer; transition: 0.3s; border-left: 4px solid transparent; 
}
.tree-file:hover { background: rgba(255,255,255,0.04); color: #fff; transform: translateX(5px); }
.tree-file.selected { background: rgba(var(--accent-rgb), 0.12); color: var(--accent); border-left-color: var(--accent); font-weight: 700; }
.f-icon-wrap { width: 26px; height: 26px; border-radius: 6px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; }
.tree-file:hover .f-icon-wrap { background: var(--accent-dim); border-color: var(--accent-glow); color: var(--accent); }
.tree-file .f-arrow { margin-left: auto; color: var(--accent); }

.explorer-preview { background: #08080a; display: flex; flex-direction: column; min-height: 0; position: relative; }
.preview-toolbar { padding: 20px 40px; border-bottom: 1px solid var(--studio-border); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); }
.p-info { display: flex; flex-direction: column; }
.p-label { font-size: 10px; font-weight: 900; color: var(--studio-muted); letter-spacing: 2px; }
.p-path { font-size: 13px; font-family: 'JetBrains Mono', monospace; color: var(--accent); margin-top: 4px; }

.code-view-box { flex: 1; overflow: hidden; position: relative; background: #050507; display: flex; flex-direction: column; }
.code-view-hd { padding: 12px 24px; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--studio-border); display: flex; align-items: center; gap: 16px; }
.code-dots { display: flex; gap: 6px; }
.code-dots span { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.1); }
.code-filename { font-size: 11px; font-weight: 700; color: var(--studio-muted); font-family: 'JetBrains Mono', monospace; }
.code-stats { margin-left: auto; display: flex; align-items: center; gap: 12px; font-size: 10px; color: var(--studio-muted); font-weight: 600; opacity: 0.6; }
.v-sep-small { width: 1px; height: 12px; background: var(--studio-border); }

.code-editor-sim { flex: 1; display: grid; grid-template-columns: 45px 1fr; position: relative; }
.code-line-numbers { padding: 25px 0; background: rgba(0,0,0,0.2); border-right: 1px solid var(--studio-border); display: flex; flex-direction: column; align-items: center; gap: 0; }
.code-line-numbers div { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: rgba(255,255,255,0.1); line-height: 2; }

.code-view-box textarea { 
  width: 100%; height: 100%; background: none; border: none; padding: 25px; 
  color: #a0aec0; font-family: 'JetBrains Mono', monospace; font-size: 13px; 
  line-height: 1.7; resize: none; outline: none; 
  overflow-y: auto !important;
}
.code-overlay { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(transparent 90%, #050507); }
.visual-view-box { flex: 1; overflow-y: auto; background: #050507; position: relative; }
.visual-preview-canvas { padding: 60px; min-height: 100%; }

.preview-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; color: var(--studio-muted); text-align: center; padding: 60px; }
.empty-icon { width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05); }
.preview-empty h3 { color: #fff; font-size: 24px; font-weight: 900; letter-spacing: 2px; }
.preview-empty p { max-width: 450px; line-height: 1.8; font-size: 15px; }

.studio-btn.primary { background: var(--accent); color: #000; border: none; padding: 12px 24px; border-radius: 12px; font-size: 12px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; box-shadow: 0 10px 25px var(--accent-glow); }
.studio-btn.primary:hover { transform: translateY(-3px); box-shadow: 0 15px 35px var(--accent-glow); }
.studio-btn.pulse { animation: buttonGlow 2s infinite; }
@keyframes buttonGlow { 0% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0.4); } 70% { box-shadow: 0 0 0 15px rgba(var(--accent-rgb), 0); } 100% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0); } }

/* ── Elite Styles ── */
.wf-hero-section {
  position: relative; height: 400px; border-radius: 24px; overflow: hidden; margin: 40px 0;
  background-size: cover; background-position: center; display: flex; align-items: flex-end; padding: 60px;
  border: 1px solid var(--studio-border);
}
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 70%); }
.hero-content { position: relative; z-index: 1; }
.hero-badge { font-size: 11px; font-weight: 900; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 15px; }
.wf-hero-section h1 { font-family: 'Orbitron', sans-serif; font-size: 3rem; color: #fff; margin: 0 0 10px; letter-spacing: -2px; }
.wf-hero-section p { font-size: 1.1rem; color: rgba(255,255,255,0.7); max-width: 600px; margin: 0; }

.wf-skill-card {
  background: rgba(10,10,15,0.6); border: 1px solid var(--studio-border); border-radius: 20px; padding: 24px;
  backdrop-filter: blur(20px); margin: 30px 0; max-width: 400px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1);
}
.skill-header { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; }
.skill-icon { font-size: 32px; color: var(--accent); filter: drop-shadow(0 0 10px var(--accent-glow)); }
.skill-meta { display: flex; flex-direction: column; }
.skill-name { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: 0.5px; }
.skill-type { font-size: 10px; font-weight: 700; color: var(--studio-muted); text-transform: uppercase; letter-spacing: 1.5px; }
.skill-stats { display: flex; gap: 20px; margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 12px; }
.skill-stat { display: flex; flex-direction: column; gap: 2px; }
.skill-stat span:first-child { font-size: 9px; font-weight: 800; color: var(--studio-muted); text-transform: uppercase; }
.skill-stat span:last-child { font-size: 13px; font-weight: 700; color: #fff; }
.skill-desc { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.5; margin: 0; }

.wf-status-alert {
  padding: 18px 24px; border-radius: 16px; display: flex; gap: 20px; align-items: flex-start;
  margin: 24px 0; border: 1px solid transparent; backdrop-filter: blur(10px);
}
.wf-status-alert :deep(svg) { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
.alert-body { display: flex; flex-direction: column; gap: 4px; }
.alert-title { font-size: 15px; font-weight: 800; }
.wf-status-alert p { font-size: 14px; margin: 0; opacity: 0.8; }

.wf-status-alert.info { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); color: #60a5fa; }
.wf-status-alert.warning { background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.3); color: #fbbf24; }
.wf-status-alert.success { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); color: #34d399; }
.wf-status-alert.error { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171; }

.wf-link-hub { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin: 30px 0; }
.link-item {
  background: rgba(255,255,255,0.03); border: 1px solid var(--studio-border); border-radius: 12px; padding: 14px;
  display: flex; align-items: center; gap: 12px; color: #fff; text-decoration: none; transition: 0.2s;
}
.link-item:hover { background: var(--accent-dim); border-color: var(--accent); transform: scale(1.02); }
.link-item :deep(svg) { font-size: 18px; color: var(--accent); }
.link-item span { font-size: 13px; font-weight: 700; }

/* ── Icon Picker UI ── */
.icon-picker-modal { max-width: 700px !important; height: 85vh !important; }
.icon-picker-content { flex: 1; display: flex; min-height: 0; overflow: hidden; height: 100%; }
.icon-picker-sidebar { width: 220px; border-right: 1px solid var(--studio-border); padding: 25px 15px; display: flex; flex-direction: column; gap: 20px; background: rgba(0,0,0,0.15); min-height: 0; }
.sidebar-footer { margin-top: auto; padding-top: 15px; border-top: 1px solid var(--studio-border); }
.icon-picker-main { flex: 1; padding: 30px; display: flex; flex-direction: column; gap: 20px; min-height: 0; overflow: hidden; }

.cat-list { display: flex; flex-direction: column; gap: 4px; overflow-y: auto; flex: 1; padding-right: 5px; }
.cat-list::-webkit-scrollbar { width: 4px; }
.cat-list::-webkit-scrollbar-thumb { background: var(--studio-border); border-radius: 10px; }

.cat-menu-btn {
  padding: 10px 14px; border-radius: 10px; background: none; border: 1px solid transparent;
  color: var(--studio-muted); font-size: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px;
  transition: 0.2s; text-transform: uppercase; letter-spacing: 0.5px; width: 100%; text-align: left;
}
.cat-menu-btn:hover { background: rgba(255,255,255,0.03); color: #fff; }
.cat-menu-btn.active { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); box-shadow: 0 4px 15px var(--accent-glow); }

.recent-icons-section { padding: 15px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid var(--studio-border); flex-shrink: 0; }
.small-hd { font-size: 9px; font-weight: 900; color: var(--studio-muted); letter-spacing: 1.5px; margin-bottom: 12px; }
.recent-grid { display: flex; gap: 10px; flex-wrap: wrap; }
.recent-pick-btn {
  width: 44px; height: 44px; border-radius: 12px; background: rgba(var(--accent-rgb), 0.05); border: 1px solid rgba(var(--accent-rgb), 0.2);
  color: var(--accent); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
  position: relative;
}
.recent-pick-btn:hover { background: var(--accent); color: #000; transform: scale(1.1) translateY(-2px); z-index: 2; box-shadow: 0 5px 15px var(--accent-glow); }
.recent-tooltip {
  position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
  background: #000; color: #fff; font-size: 9px; padding: 4px 8px; border-radius: 4px;
  opacity: 0; pointer-events: none; transition: 0.2s; white-space: nowrap; z-index: 10; border: 1px solid var(--studio-border);
}
.recent-pick-btn:hover .recent-tooltip { opacity: 1; bottom: -35px; }

.icon-grid { 
  display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; 
  flex: 1; overflow-y: auto; padding-right: 10px;
}
.icon-grid::-webkit-scrollbar { width: 4px; }
.icon-grid::-webkit-scrollbar-thumb { background: var(--studio-border); border-radius: 10px; }

.icon-pick-btn {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;
  padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: #fff; cursor: pointer; transition: 0.2s;
}
.icon-pick-btn:hover { background: var(--accent-dim); border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
.icon-pick-btn span { font-size: 10px; font-weight: 600; opacity: 0.6; }
.icon-picker-manual { padding: 15px; background: rgba(0,0,0,0.3); border-radius: 16px; border: 1px solid var(--studio-border); flex-shrink: 0; }
.icon-picker-manual label { display: block; font-size: 10px; font-weight: 900; color: var(--studio-muted); text-transform: uppercase; margin-bottom: 10px; }

.field-with-btn { display: flex; gap: 8px; width: 100%; }
.field-with-btn button { 
  width: 40px; height: 40px; border-radius: 12px; background: var(--accent-dim); border: 1px solid var(--accent);
  color: var(--accent); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; flex-shrink: 0;
}
.field-with-btn button:hover { background: var(--accent); color: #000; box-shadow: 0 0 15px var(--accent-glow); }

/* ── Block Actions ── */
.blk-actions { display: flex; gap: 4px; margin-left: 10px; }
.blk-actions button {
  width: 28px; height: 28px; border-radius: 6px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
}
.blk-actions button:hover:not(:disabled) { background: rgba(255,255,255,0.2); border-color: #fff; }
.blk-actions button.del:hover { background: #ef4444; border-color: #ef4444; }
.blk-actions button:disabled { opacity: 0.2; cursor: not-allowed; }

.tree-empty { 
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  padding: 60px 20px; color: var(--studio-muted); text-align: center; gap: 12px;
}
.empty-glow-icon { 
  width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.03); 
  display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px;
}
.empty-title { font-size: 12px; font-weight: 700; color: #fff; letter-spacing: 1px; }
.empty-sub { font-size: 11px; opacity: 0.6; line-height: 1.6; max-width: 220px; }

/* ── Custom Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }

/* ── Toast ── */
.studio-toast { 
  position: fixed; bottom: 40px; right: 40px; background: #15151c; border: 1px solid var(--studio-border); padding: 16px 28px; border-radius: 16px; 
  display: flex; align-items: center; gap: 14px; color: #fff; font-size: 14px; font-weight: 700; z-index: 100001; 
  box-shadow: 0 30px 60px rgba(0,0,0,0.6); border-left: 5px solid var(--accent);
  backdrop-filter: blur(15px); animation: toastIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes toastIn { from { transform: translateX(100%) scale(0.8); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
.studio-toast.success { border-left-color: #10b981; }
.studio-toast.error { border-left-color: #ef4444; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.studio-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
.studio-switch input { opacity: 0; width: 0; height: 0; }
.switch-slider { position: absolute; cursor: pointer; inset: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 20px; }
.switch-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: #fff; transition: .4s; border-radius: 50%; }
input:checked + .switch-slider { background-color: var(--accent); }
input:checked + .switch-slider:before { transform: translateX(18px); }

.switch-label { font-size: 11px; font-weight: 700; color: #fff; margin-left: 10px; opacity: 0.8; }

/* ── Enhanced Card Styles ── */
.wf-info-card-media { margin: -25px -25px 20px -25px; overflow: hidden; border-radius: 20px 20px 0 0; border-bottom: 1px solid var(--studio-border); }
.wf-info-card-media img { transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.wf-info-card:hover .wf-info-card-media img { transform: scale(1.05); }
.canvas-card-link-preview { margin-top: 15px; font-size: 10px; font-weight: 700; color: var(--accent); opacity: 0.5; display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; }

@media (max-width: 1100px) { .pg-main-layout { grid-template-columns: 1fr; } }

/* ── Elite Components ── */
.canvas-lore-header { text-align: center; margin: 40px 0; position: relative; }
.lore-sub { font-family: 'Orbitron', sans-serif; letter-spacing: 4px; color: var(--vp-c-brand-1); font-size: 11px; margin-bottom: 8px; opacity: 0.6; }
.lore-title { font-family: 'Orbitron', sans-serif; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; background: linear-gradient(to bottom, #fff, #888); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.lore-divider { width: 40px; height: 2px; background: var(--vp-c-brand-1); margin: 20px auto 0; box-shadow: 0 0 15px var(--accent-glow); }

.wf-numbered-steps { display: flex; flex-direction: column; gap: 16px; margin: 30px 0; }
.wf-step-item { display: flex; gap: 20px; align-items: flex-start; }
.step-num { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-dim); color: var(--vp-c-brand-1); display: flex; align-items: center; justify-content: center; font-weight: 900; font-family: 'Orbitron', sans-serif; font-size: 14px; border: 1px solid var(--vp-c-brand-1); flex-shrink: 0; }
.step-text { flex: 1; font-size: 14px; line-height: 1.6; padding-top: 4px; }

.wf-hero-section { position: relative; height: 300px; border-radius: 24px; overflow: hidden; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; margin: 30px 0; border: 1px solid var(--studio-border); }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2)); }
.hero-content { position: relative; z-index: 1; text-align: center; padding: 30px; }
.hero-badge { font-family: 'Orbitron', sans-serif; font-size: 11px; letter-spacing: 2px; margin-bottom: 12px; font-weight: 700; color: var(--vp-c-brand-1); }
.hero-content h1 { font-family: 'Orbitron', sans-serif; font-size: 28px; margin: 0 0 12px; font-weight: 900; color: #fff; }
.hero-content p { font-size: 14px; color: rgba(255,255,255,0.7); max-width: 400px; margin: 0 auto; }

.wf-skill-card { background: rgba(255,255,255,0.02); border: 1px solid var(--studio-border); border-radius: 20px; padding: 24px; margin: 30px 0; position: relative; overflow: hidden; }
.skill-header { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; }
.skill-icon { font-size: 32px; color: var(--vp-c-brand-1); }
.skill-name { font-family: 'Orbitron', sans-serif; font-weight: 800; font-size: 18px; display: block; }
.skill-type { font-size: 11px; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
.skill-stats { display: flex; gap: 12px; margin-bottom: 20px; }
.skill-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 6px 12px; display: flex; gap: 8px; font-size: 12px; }
.skill-stat span:first-child { opacity: 0.5; font-weight: 600; }
.skill-stat span:last-child { color: var(--vp-c-brand-1); font-weight: 800; font-family: 'Orbitron', sans-serif; }
.skill-desc { font-size: 13px; line-height: 1.6; opacity: 0.8; }

.wf-status-alert { display: flex; gap: 16px; padding: 16px 20px; border-radius: 14px; margin: 20px 0; border-left: 4px solid; background: rgba(255,255,255,0.02); }
.wf-status-alert.info { border-left-color: #3b82f6; }
.wf-status-alert.warning { border-left-color: #f59e0b; }
.wf-status-alert.error { border-left-color: #ef4444; }
.wf-status-alert :deep(svg) { font-size: 20px; flex-shrink: 0; }
.alert-title { font-weight: 800; font-size: 14px; margin-bottom: 4px; display: block; font-family: 'Orbitron', sans-serif; }
.alert-body p { margin: 0; font-size: 13px; opacity: 0.8; }

.canvas-grid-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  border: 1px dashed rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 16px;
  position: relative;
  min-height: 50px;
  margin-bottom: 32px;
}
.grid-marker-end { position: absolute; bottom: -10px; right: 20px; background: #000; color: var(--studio-muted); font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid var(--studio-border); display: flex; align-items: center; gap: 4px; }
.preview-mini-placeholder { padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 10px; color: var(--studio-muted); text-align: center; font-weight: 700; border: 1px dashed rgba(255,255,255,0.1); }

/* ═══════════════════════════════════════════════════════
   GROUP A — LORE QUOTE
══════════════════════════════════════════════════════════ */
.wf-lore-quote {
  position: relative; margin: 32px 0; padding: 32px 36px 28px;
  background: rgba(255,255,255,0.03); border-left: 3px solid var(--accent);
  border-radius: 0 16px 16px 0; border: 1px solid var(--studio-border);
  border-left: 3px solid var(--accent); backdrop-filter: blur(10px);
}
.wf-lore-quote .quote-icon {
  color: var(--accent); opacity: 0.25; position: absolute; top: 20px; left: 20px;
  width: 36px !important; height: 36px !important;
}
.wf-lore-quote p {
  font-size: 16px; line-height: 1.8; font-style: italic;
  color: rgba(255,255,255,0.85); margin: 0 0 16px; padding-left: 8px;
}
.wf-lore-quote cite {
  display: block; text-align: right; font-size: 12px; font-weight: 700;
  color: var(--accent); opacity: 0.8; font-style: normal;
  font-family: 'Orbitron', sans-serif; letter-spacing: 1px;
}

/* ═══════════════════════════════════════════════════════
   GROUP B — COMPARE GRID
══════════════════════════════════════════════════════════ */
.wf-compare-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0;
}
.compare-col {
  background: rgba(255,255,255,0.03); border: 1px solid var(--studio-border);
  border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 0;
}
.compare-col.left { border-top: 2px solid rgba(var(--accent-rgb), 0.5); }
.compare-col.right { border-top: 2px solid rgba(16,185,129,0.5); }
.col-hd {
  display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
  font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700;
  color: #fff; letter-spacing: 1px; padding-bottom: 12px;
  border-bottom: 1px solid var(--studio-border);
}
.col-hd :deep(svg) { color: var(--accent); width: 16px; height: 16px; }
.compare-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); gap: 10px;
}
.compare-row:last-child { border-bottom: none; }
.row-label { font-size: 12px; color: var(--studio-muted); font-weight: 600; }
.row-val { font-size: 13px; font-weight: 700; color: #fff; }
.row-val.highlight { color: #10b981; font-family: 'Orbitron', sans-serif; font-size: 12px; }

/* ═══════════════════════════════════════════════════════
   GROUP C — KEY GRID
══════════════════════════════════════════════════════════ */
.wf-key-grid {
  display: flex; flex-direction: column; gap: 10px; margin: 28px 0;
  padding: 20px; background: rgba(255,255,255,0.02);
  border: 1px solid var(--studio-border); border-radius: 16px;
}
.key-item {
  display: flex; align-items: center; gap: 18px;
  font-size: 14px; color: rgba(255,255,255,0.75);
  padding: 6px 0;
}
kbd {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 36px; padding: 5px 10px; font-size: 11px; font-weight: 800;
  font-family: 'JetBrains Mono', monospace; color: var(--accent);
  background: rgba(0,0,0,0.5); border: 1px solid rgba(var(--accent-rgb), 0.4);
  border-bottom: 3px solid rgba(var(--accent-rgb), 0.6);
  border-radius: 7px; letter-spacing: 0.5px; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

/* ═══════════════════════════════════════════════════════
   GROUP D — FEATURE GRID (fix sub-classes)
══════════════════════════════════════════════════════════ */
.feature-header {
  font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 900;
  color: var(--accent); letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 16px; opacity: 0.9;
}
.feature-items {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;
}
.feature-item :deep(svg) { color: var(--accent); width: 22px; height: 22px; flex-shrink: 0; }

/* ═══════════════════════════════════════════════════════
   GROUP E — TIMELINE (fix existing)
══════════════════════════════════════════════════════════ */
.wf-timeline { margin: 36px 0; display: flex; flex-direction: column; gap: 0; position: relative; padding-left: 28px; }
.wf-timeline::before {
  content: ''; position: absolute; left: 6px; top: 6px; bottom: 6px;
  width: 2px; background: linear-gradient(to bottom, var(--accent), transparent);
  border-radius: 2px;
}
.timeline-point { display: flex; gap: 18px; align-items: flex-start; padding-bottom: 24px; position: relative; }
.point-marker {
  width: 14px; height: 14px; border-radius: 50%; background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow); flex-shrink: 0; margin-top: 3px;
  position: absolute; left: -28px; border: 2px solid rgba(var(--accent-rgb),0.3);
}
.point-content { display: flex; flex-direction: column; gap: 4px; }
.point-content strong {
  font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 800;
  color: var(--accent); letter-spacing: 1px;
}
.point-content span { font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.5; }

/* ═══════════════════════════════════════════════════════
   GROUP F — PROGRESS BAR
══════════════════════════════════════════════════════════ */
.wf-progress-wrap { margin: 28px 0; }
.progress-info {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
}
.p-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); }
.p-val {
  font-size: 13px; font-weight: 800; color: var(--accent);
  font-family: 'Orbitron', sans-serif; letter-spacing: 1px;
}
.progress-track {
  height: 8px; background: rgba(255,255,255,0.06); border-radius: 100px;
  overflow: hidden; border: 1px solid rgba(255,255,255,0.06);
}
.progress-bar {
  height: 100%; border-radius: 100px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
  background: linear-gradient(90deg, var(--accent), rgba(var(--accent-rgb),0.6));
  box-shadow: 0 0 10px var(--accent-glow);
}

/* ═══════════════════════════════════════════════════════
   GROUP G — IMAGE GALLERY
══════════════════════════════════════════════════════════ */
.gallery-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px; margin: 28px 0;
}
.gallery-img {
  width: 100%; aspect-ratio: 16/9; object-fit: cover;
  border-radius: 12px; border: 1px solid var(--studio-border);
  transition: transform 0.4s ease, box-shadow 0.4s ease; display: block;
}
.gallery-img:hover { transform: scale(1.04); box-shadow: 0 12px 30px rgba(0,0,0,0.5); }

/* ═══════════════════════════════════════════════════════
   GROUP H — VIDEO EMBED
══════════════════════════════════════════════════════════ */
.wf-video-embed { margin: 32px 0; }
.video-placeholder {
  position: relative; aspect-ratio: 16/9; background: rgba(0,0,0,0.6);
  border: 1px solid var(--studio-border); border-radius: 16px; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; cursor: pointer; backdrop-filter: blur(10px);
  transition: border-color 0.3s;
}
.video-placeholder::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at center, rgba(var(--accent-rgb),0.08) 0%, transparent 70%);
}
.video-placeholder:hover { border-color: rgba(var(--accent-rgb),0.4); }
.play-icon {
  color: var(--accent) !important; position: relative; z-index: 1;
  filter: drop-shadow(0 0 16px var(--accent-glow));
  transition: transform 0.3s ease;
}
.video-placeholder:hover .play-icon { transform: scale(1.1); }
.v-title {
  font-size: 15px; font-weight: 700; color: #fff; position: relative; z-index: 1;
  font-family: 'Orbitron', sans-serif; letter-spacing: 0.5px;
}
.v-id {
  font-size: 11px; color: var(--studio-muted); font-family: 'JetBrains Mono', monospace;
  position: relative; z-index: 1; opacity: 0.7;
}

/* ═══════════════════════════════════════════════════════
   GROUP I — FILE DOWNLOAD
══════════════════════════════════════════════════════════ */
.wf-file-download-preview { margin: 28px 0; }
.wf-file-download {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 20px; border-radius: 14px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--studio-border);
  transition: 0.25s; cursor: pointer;
}
.wf-file-download:hover {
  background: rgba(var(--accent-rgb),0.06); border-color: rgba(var(--accent-rgb),0.3);
  transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}
.wf-file-download :deep(svg) { color: var(--accent); flex-shrink: 0; }
.file-info { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.file-label { font-size: 14px; font-weight: 700; color: #fff; }
.file-size {
  font-size: 11px; color: var(--studio-muted);
  font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px;
}

/* ═══════════════════════════════════════════════════════
   GROUP J — CODE BOX
══════════════════════════════════════════════════════════ */
.canvas-code-box {
  border-radius: 16px; overflow: hidden; border: 1px solid var(--studio-border);
  margin: 28px 0; background: #050507;
}
.code-hd {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 16px; background: rgba(255,255,255,0.03);
  border-bottom: 1px solid var(--studio-border);
}
.code-hd .code-dots { display: flex; gap: 6px; }
.code-hd .code-dots span { width: 10px; height: 10px; border-radius: 50%; }
.code-hd .code-dots span:nth-child(1) { background: #ff5f57; }
.code-hd .code-dots span:nth-child(2) { background: #febc2e; }
.code-hd .code-dots span:nth-child(3) { background: #28c840; }
.code-hd > span {
  font-size: 10px; font-weight: 800; color: var(--studio-muted);
  letter-spacing: 1.5px; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;
}
.canvas-code-box pre {
  margin: 0; padding: 20px 24px; background: #050507; overflow-x: auto;
}
.canvas-code-box code {
  font-family: 'JetBrains Mono', monospace; font-size: 13px;
  line-height: 1.75; color: #a0aec0;
}

/* ═══════════════════════════════════════════════════════
   GROUP K — TABLE BOX
══════════════════════════════════════════════════════════ */
.canvas-table-box {
  overflow-x: auto; margin: 28px 0; border-radius: 16px;
  border: 1px solid var(--studio-border);
}
.canvas-table-box table { width: 100%; border-collapse: collapse; font-size: 13px; }
.canvas-table-box th {
  padding: 10px 16px; background: rgba(var(--accent-rgb),0.08);
  border: 1px solid var(--studio-border); color: var(--accent); font-weight: 800;
  text-align: left; font-size: 11px; letter-spacing: 0.5px;
  font-family: 'Orbitron', sans-serif; text-transform: uppercase;
}
.canvas-table-box td {
  padding: 10px 16px; border: 1px solid var(--studio-border);
  color: rgba(255,255,255,0.7); transition: background 0.2s;
}
.canvas-table-box tr:hover td { background: rgba(255,255,255,0.02); }

/* ═══════════════════════════════════════════════════════
   GROUP L — COLLAPSIBLE
══════════════════════════════════════════════════════════ */
.wf-info-collapse {
  margin: 24px 0; border-radius: 16px; border: 1px solid var(--studio-border);
  background: rgba(255,255,255,0.02); overflow: hidden;
}
.wf-info-collapse-title {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; cursor: pointer; font-size: 14px; font-weight: 700;
  color: #fff; transition: background 0.2s;
}
.wf-info-collapse-title:hover { background: rgba(var(--accent-rgb),0.05); color: var(--accent); }
.wf-info-collapse-title :deep(svg) { color: var(--accent); flex-shrink: 0; }
.wf-info-collapse-body {
  padding: 14px 20px 18px; font-size: 14px; line-height: 1.7;
  color: rgba(255,255,255,0.7); border-top: 1px solid var(--studio-border);
}
.wf-collapse-preview {
  background: rgba(255,255,255,0.03); border: 1px solid var(--studio-border);
  border-radius: 12px; overflow: hidden; margin-bottom: 10px;
}
.wf-collapse-hd {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; font-size: 13px; font-weight: 700; color: #fff;
}
.wf-collapse-hd :deep(svg) { color: var(--accent); }

/* ═══════════════════════════════════════════════════════
   GROUP M — COMMAND PREVIEW (refactored)
══════════════════════════════════════════════════════════ */
.canvas-command-preview {
  margin: 20px 0; padding: 16px 20px; border-radius: 14px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--studio-border);
  display: flex; flex-direction: column; gap: 8px;
}
.canvas-command-preview .cmd-label {
  font-size: 11px; color: var(--studio-muted); font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
}
.canvas-command-preview code {
  display: inline-block; padding: 6px 14px; border-radius: 8px;
  font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px;
  background: rgba(var(--accent-rgb),0.1); border: 1px solid rgba(var(--accent-rgb),0.25);
  color: var(--accent); letter-spacing: 0.5px;
}

/* ═══════════════════════════════════════════════════════
   GROUP N — MEDIA SHOWCASE
══════════════════════════════════════════════════════════ */
.media-showcase-canvas { margin: 24px 0; }
.media-showcase-canvas .showcase-outer {
  border-radius: 16px; overflow: hidden;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px;
}
.media-showcase-canvas .showcase-inner { position: relative; border-radius: 12px; overflow: hidden; }
.media-showcase-canvas img { width: 100%; height: auto; display: block; border-radius: 12px; }
.media-showcase-canvas .showcase-badge {
  position: absolute; bottom: 12px; right: 12px;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
  padding: 4px 12px; border-radius: 20px; font-size: 11px;
  font-family: 'Orbitron', monospace; color: var(--accent);
}
.media-showcase-canvas .showcase-caption {
  text-align: center; padding: 12px; font-size: 12px; color: var(--studio-muted);
}

/* ═══════════════════════════════════════════════════════
   GROUP O — STEPS PREVIEW
══════════════════════════════════════════════════════════ */
.canvas-steps-preview { margin: 24px 0; }
.wf-system-custom-list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 10px;
}
.wf-system-custom-list li {
  display: flex; align-items: center; gap: 14px;
  font-size: 14px; color: rgba(255,255,255,0.8);
  padding: 8px 12px; border-radius: 10px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  transition: background 0.2s;
}
.wf-system-custom-list li:hover { background: rgba(var(--accent-rgb),0.05); }
.wf-system-custom-list li :deep(svg) { color: var(--accent); flex-shrink: 0; }

/* ═══════════════════════════════════════════════════════
   GROUP P — IMAGE + CAPTION
══════════════════════════════════════════════════════════ */
.canvas-image-wrap { margin: 24px 0; }
.image-caption {
  text-align: center; font-size: 12px; color: var(--studio-muted);
  font-style: italic; margin-top: 8px; opacity: 0.8;
}

/* ═══════════════════════════════════════════════════════
   GROUP Q — MINI / GRID SUB-BLOCK PREVIEWS
══════════════════════════════════════════════════════════ */
.mini-grid {
  display: flex; flex-direction: column; gap: 5px; font-size: 11px; margin: 6px 0;
}
.mini-progress { margin: 8px 0; }
.mini-progress .progress-track { height: 5px; }
.mini-tip {
  padding: 8px 12px; border-radius: 10px; font-size: 12px;
  display: flex; align-items: center; gap: 8px; margin: 6px 0;
}
.mini-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;
  background: rgba(var(--accent-rgb),0.1); border: 1px solid rgba(var(--accent-rgb),0.3);
  color: var(--accent);
}
.wf-code-preview {
  background: #050507; border-radius: 8px; padding: 8px 12px;
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #a0aec0;
  max-height: 60px; overflow: hidden; border: 1px solid var(--studio-border);
}
.wf-table-preview { font-size: 11px; overflow: hidden; }
.wf-table-preview table { width: 100%; border-collapse: collapse; }
.wf-table-preview th { font-size: 9px; padding: 4px 8px; background: rgba(var(--accent-rgb),0.08); color: var(--accent); }
.wf-table-preview td { font-size: 10px; padding: 4px 8px; border: 1px solid var(--studio-border); color: rgba(255,255,255,0.6); }
.wf-video-preview, .wf-file-preview, .wf-quote-preview, .wf-compare-preview, .wf-key-preview {
  padding: 8px 10px; background: rgba(255,255,255,0.02); border-radius: 8px;
  font-size: 11px; color: var(--studio-muted); border: 1px solid rgba(255,255,255,0.05);
}
.wf-feature-grid.mini .feature-header { font-size: 9px; margin-bottom: 8px; }
.wf-feature-grid.mini .feature-items { grid-template-columns: 1fr 1fr; gap: 6px; }
.wf-feature-grid.mini .feature-item { padding: 10px; gap: 6px; }
.wf-feature-grid.mini .feature-item span { font-size: 11px; }
.wf-timeline.mini { padding-left: 16px; margin: 8px 0; }
.wf-timeline.mini .timeline-point { padding-bottom: 12px; }
.wf-timeline.mini .point-marker { width: 8px; height: 8px; left: -16px; }
.wf-timeline.mini .point-content strong { font-size: 10px; }
.wf-timeline.mini .point-content span { font-size: 11px; }
.wf-progress-wrap.mini { margin: 6px 0; }
.wf-progress-wrap.mini .p-label { font-size: 11px; }
.wf-progress-wrap.mini .p-val { font-size: 11px; }
.wf-progress-wrap.mini .progress-track { height: 5px; }
.wf-image-gallery.mini .gallery-grid { grid-template-columns: 1fr 1fr; gap: 6px; }
.wf-image-gallery.mini .gallery-img { border-radius: 6px; }
.wf-lore-quote.mini { padding: 12px 16px; margin: 6px 0; }
.wf-lore-quote.mini p { font-size: 12px; margin: 0; }

/* ═══════════════════════════════════════════════════════
   GROUP R — EXPLORER MINIATURE BLOCKS
══════════════════════════════════════════════════════════ */
.canvas-blk-wrap.miniature {
  margin-bottom: 8px; padding: 0; font-size: 11px; border-radius: 10px;
  cursor: default;
}
.canvas-blk-wrap.miniature::before,
.canvas-blk-wrap.miniature::after { display: none !important; }
.canvas-blk-wrap.miniature .wf-info-title { font-size: 12px; margin: 0 0 4px; }
.canvas-blk-wrap.miniature .canvas-paragraph { font-size: 11px; margin-bottom: 6px; }
.mini-fallback {
  padding: 8px 12px; background: rgba(255,255,255,0.02);
  border-radius: 8px; font-size: 11px; color: var(--studio-muted);
  border: 1px dashed rgba(255,255,255,0.06); margin-bottom: 6px;
}
.mini-badge-wrap { margin-bottom: 6px; }
.mini-image { margin-bottom: 6px; border-radius: 8px; overflow: hidden; }
.mini-title {
  font-size: 11px; font-weight: 700; color: #fff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mini-body {
  font-size: 10px; color: var(--studio-muted); margin-top: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.wf-info-stat-item.mini { padding: 8px 10px; }
.wf-info-stat-number.mini { font-size: 18px; }
.wf-info-card.mini { padding: 10px 12px; }
.wf-info-card.mini .wf-info-icon { width: 28px; height: 28px; border-radius: 8px; }
.wf-info-card.mini .wf-info-icon :deep(svg) { width: 14px; height: 14px; }
.canvas-paragraph.mini { font-size: 11px; line-height: 1.5; margin-bottom: 6px; }
.canvas-paragraph.mini { font-size: 11px; line-height: 1.5; margin-bottom: 6px; }
.wf-info-title.mini { font-size: 13px; padding: 8px 0; }

/* ═══════════════════════════════════════════════════════
   AREA 1 — LIQUID GLASS SIDEBAR BRAND HEADER
══════════════════════════════════════════════════════════ */
.pg-editor-sidebar {
  border-right: 1px solid rgba(255,255,255,0.08);
  display: flex; flex-direction: column;
  background: rgba(10,10,12,0.4);
  backdrop-filter: blur(40px) saturate(160%);
  -webkit-backdrop-filter: blur(40px) saturate(160%);
  position: relative; overflow: hidden;
}

.pg-sidebar-brand {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(10px); flex-shrink: 0;
}
.psb-logo { display: flex; align-items: center; gap: 10px; }
.psb-orb {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, rgba(var(--accent-rgb),0.2), rgba(var(--accent-rgb),0.05));
  border: 1px solid rgba(var(--accent-rgb),0.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent); flex-shrink: 0;
  box-shadow: 0 0 15px rgba(var(--accent-rgb),0.15), inset 0 1px 1px rgba(255,255,255,0.1);
}
.psb-label { display: flex; flex-direction: column; line-height: 1; gap: 2px; }
.psb-title { font-size: 13px; font-weight: 900; color: #fff; letter-spacing: 3px; }
.psb-sub { font-size: 8px; color: var(--accent); font-weight: 700; letter-spacing: 2.5px; opacity: 0.9; }
.psb-add-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 99px;
  background: linear-gradient(135deg, rgba(var(--accent-rgb),0.15), rgba(var(--accent-rgb),0.05));
  border: 1px solid rgba(var(--accent-rgb),0.3);
  color: var(--accent); font-size: 10px; font-weight: 900;
  cursor: pointer; transition: 0.3s cubic-bezier(0.16,1,0.3,1);
  letter-spacing: 1px; white-space: nowrap;
  box-shadow: 0 0 15px rgba(var(--accent-rgb),0.1), inset 0 1px 1px rgba(255,255,255,0.08);
}
.psb-add-btn:hover, .psb-add-btn.open {
  background: var(--accent); color: #000;
  box-shadow: 0 0 25px rgba(var(--accent-rgb),0.4);
  transform: translateY(-1px);
}

/* ═══════════════════════════════════════════════════════
   AREA 2 — BLOCK PALETTE PANEL
══════════════════════════════════════════════════════════ */
.palette-panel {
  border-bottom: 1px solid rgba(255,255,255,0.07);
  background: rgba(0,0,0,0.5); flex-shrink: 0;
  backdrop-filter: blur(30px); z-index: 20;
  max-height: 55vh; display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.palette-tabs {
  display: flex; gap: 4px; padding: 10px 12px 8px;
  overflow-x: auto; flex-shrink: 0;
  scrollbar-width: none; border-bottom: 1px solid rgba(255,255,255,0.06);
}
.palette-tabs::-webkit-scrollbar { display: none; }
.palette-tab {
  padding: 5px 12px; border-radius: 99px; font-size: 9px; font-weight: 900;
  letter-spacing: 1px; text-transform: uppercase; white-space: nowrap;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  color: var(--studio-muted); cursor: pointer; transition: 0.2s;
}
.palette-tab:hover { background: rgba(255,255,255,0.08); color: #fff; }
.palette-tab.active {
  background: linear-gradient(135deg, rgba(var(--accent-rgb),0.2), rgba(var(--accent-rgb),0.08));
  border-color: rgba(var(--accent-rgb),0.4); color: var(--accent);
  box-shadow: 0 0 12px rgba(var(--accent-rgb),0.2), inset 0 1px 1px rgba(255,255,255,0.06);
}
.palette-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
  padding: 10px 12px 12px; overflow-y: auto;
  scrollbar-width: thin; scrollbar-color: var(--studio-border) transparent;
}
.palette-card {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 10px 6px; border-radius: 12px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  cursor: pointer; transition: 0.2s cubic-bezier(0.16,1,0.3,1);
  text-align: center;
}
.palette-card:hover {
  background: rgba(255,255,255,0.07); border-color: rgba(var(--accent-rgb),0.3);
  transform: scale(1.04) translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3), 0 0 15px rgba(var(--accent-rgb),0.1);
}
.palette-card-icon {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  transition: 0.2s;
}
.palette-card:hover .palette-card-icon { transform: scale(1.1); }
.palette-card-label {
  font-size: 9px; font-weight: 800; color: #fff; letter-spacing: 0.5px;
  line-height: 1.2; font-family: 'Orbitron', sans-serif;
}
.palette-card-group {
  font-size: 8px; color: var(--studio-muted); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7;
}

/* Palette slide-down transition */
.palette-slide-enter-active { transition: max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease; }
.palette-slide-leave-active { transition: max-height 0.25s ease, opacity 0.15s ease; }
.palette-slide-enter-from, .palette-slide-leave-to { max-height: 0; opacity: 0; overflow: hidden; }
.palette-slide-enter-to, .palette-slide-leave-from { max-height: 55vh; opacity: 1; }

/* ═══════════════════════════════════════════════════════
   AREA 3 — LIVE CASHEADER MINI-STRIP
══════════════════════════════════════════════════════════ */
.pg-live-header-strip {
  margin: 8px 10px; border-radius: 14px; overflow: hidden;
  background: linear-gradient(135deg, rgba(var(--accent-rgb),0.07) 0%, rgba(0,0,0,0.3) 100%);
  border: 1px solid rgba(var(--accent-rgb),0.2);
  padding: 12px 14px; display: flex; flex-direction: column; gap: 5px;
  backdrop-filter: blur(10px);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 15px rgba(0,0,0,0.3);
}
.lhs-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.lhs-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 8px; border-radius: 99px;
  background: rgba(var(--accent-rgb),0.15); border: 1px solid rgba(var(--accent-rgb),0.3);
  font-size: 8px; font-weight: 900; color: var(--accent);
  font-family: 'Orbitron', sans-serif; letter-spacing: 1.5px; text-transform: uppercase;
}
.lhs-badge :deep(svg) { color: var(--accent); }
.lhs-tags { display: flex; gap: 4px; }
.lhs-tag {
  font-size: 8px; font-weight: 700; padding: 2px 7px; border-radius: 4px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  color: var(--studio-muted); letter-spacing: 0.5px;
}
.lhs-title {
  font-size: 13px; font-weight: 800; color: #fff; line-height: 1.2;
  font-family: 'Orbitron', sans-serif; letter-spacing: -0.3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.lhs-path { display: flex; align-items: center; gap: 0; flex-wrap: wrap; }
.lhs-crumb { font-size: 10px; color: var(--studio-muted); font-weight: 600; display: inline-flex; align-items: center; }
.lhs-sep { margin: 0 4px; opacity: 0.4; font-size: 11px; }

/* Block count badge in Content Blocks header */
.blk-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: rgba(var(--accent-rgb),0.15); border: 1px solid rgba(var(--accent-rgb),0.3);
  border-radius: 99px; font-size: 10px; font-weight: 800; color: var(--accent);
  font-family: 'Orbitron', sans-serif; line-height: 1;
}

/* ═══════════════════════════════════════════════════════
   AREA 4 — THEME PALETTE (LABELED SWATCHES)
══════════════════════════════════════════════════════════ */
.pg-theme-palette {
  display: flex; gap: 6px; align-items: center;
  background: rgba(0,0,0,0.35); padding: 6px 8px; border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(255,255,255,0.03);
}
.theme-swatch {
  display: flex; align-items: center; gap: 6px;
  padding: 4px 10px 4px 5px; border-radius: 99px;
  background: transparent; border: 1px solid transparent;
  cursor: pointer; transition: 0.3s cubic-bezier(0.16,1,0.3,1);
  position: relative;
}
.theme-swatch:hover {
  background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12);
}
.theme-swatch.active {
  background: linear-gradient(135deg, rgba(var(--tc-rgb, 255,120,0),0.15), rgba(var(--tc-rgb, 255,120,0),0.04));
  border-color: color-mix(in srgb, var(--tc) 40%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--tc) 30%, transparent),
              inset 0 1px 1px rgba(255,255,255,0.06);
}
.swatch-orb {
  width: 16px; height: 16px; border-radius: 50%; background: var(--tc);
  box-shadow: 0 0 8px var(--tc); flex-shrink: 0; transition: 0.3s;
}
.theme-swatch.active .swatch-orb { transform: scale(1.15); box-shadow: 0 0 14px var(--tc); }
.swatch-name {
  font-size: 8px; font-weight: 900; color: rgba(255,255,255,0.5);
  letter-spacing: 1.5px; font-family: 'Orbitron', sans-serif; text-transform: uppercase;
  transition: color 0.3s;
}
.theme-swatch.active .swatch-name { color: var(--tc); }
.swatch-check { color: var(--tc); flex-shrink: 0; }

/* ═══════════════════════════════════════════════════════
   AREA 5 — IMPORT IMPROVEMENTS
══════════════════════════════════════════════════════════ */
.explorer-folder-filter {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 24px; background: rgba(0,0,0,0.2);
  border-bottom: 1px solid var(--studio-border); flex-shrink: 0;
}
.folder-filter-label {
  font-size: 9px; font-weight: 800; color: var(--studio-muted);
  letter-spacing: 1.5px; text-transform: uppercase; white-space: nowrap;
}
.folder-filter-select {
  flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px; padding: 5px 10px; font-size: 11px; color: #fff;
  outline: none; cursor: pointer;
}
.import-summary-bar {
  padding: 12px 20px; border-top: 1px solid var(--studio-border);
  background: rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px;
  flex-wrap: wrap; flex-shrink: 0;
}
.import-summary-label {
  font-size: 10px; font-weight: 700; color: var(--studio-muted);
  letter-spacing: 1px; margin-right: 4px;
}
.import-block-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
  color: #fff; white-space: nowrap;
}
.import-block-chip .chip-dot { width: 6px; height: 6px; border-radius: 50%; }

/* ═══════════════════════════════════════════════════════
   UNDO / REDO BUTTONS
══════════════════════════════════════════════════════════ */
.pg-undo-redo-group {
  display: flex; align-items: center; padding: 4px 6px; gap: 6px;
  background: var(--glass); border: 1px solid var(--glass-border); border-radius: 12px;
}
.ur-btn {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 8px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  color: #fff; cursor: pointer; transition: 0.3s;
}
.ur-btn:hover:not(:disabled) {
  background: rgba(var(--accent-rgb), 0.2); color: var(--accent);
  border-color: rgba(var(--accent-rgb), 0.5); box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.2);
  transform: translateY(-1px);
}
.ur-btn:disabled { opacity: 0.2; cursor: not-allowed; }
.ur-count {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800;
  color: var(--studio-muted); min-width: 32px; text-align: center;
}

/* ═══════════════════════════════════════════════════════
   VS CODE STYLE STATUS BAR
══════════════════════════════════════════════════════════ */
.pg-status-bar {
  display: flex; align-items: center; justify-content: space-between;
  height: 28px; background: rgba(0,0,0,0.6);
  border-top: 1px solid var(--studio-border);
  padding: 0 12px; font-size: 11px; font-weight: 600;
  color: var(--studio-muted); flex-shrink: 0;
  font-family: 'Inter', sans-serif;
}
.status-left, .status-right, .status-center { display: flex; align-items: center; gap: 16px; }
.status-item {
  display: flex; align-items: center; gap: 6px; white-space: nowrap;
}
.status-item.btn {
  cursor: pointer; transition: color 0.2s; background: none; border: none; padding: 0;
  color: inherit; font: inherit;
}
.status-item.btn:hover:not(:disabled) { color: #fff; }
.status-item.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.status-item.accent { color: var(--accent); }
.status-item.highlight { color: #fff; }
.status-item.saving { color: #f59e0b; }
.status-item.saved { color: #10b981; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* ═══════════════════════════════════════════════════════
   BACKUP MODAL (LIQUID GLASS ELITE)
══════════════════════════════════════════════════════════ */
.backup-modal { 
  width: 520px; max-height: 85vh; 
  background: radial-gradient(circle at top left, rgba(255,255,255,0.05), transparent 40%), rgba(10, 10, 12, 0.45) !important;
  border: 1px solid rgba(255,255,255,0.2) !important;
  box-shadow: 0 80px 200px rgba(0,0,0,0.95), inset 0 1px 1px rgba(255,255,255,0.15) !important;
}
.backup-controls {
  display: flex; gap: 12px; padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
}
.backup-input {
  flex: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 12px 18px; font-size: 14px; color: #fff;
  outline: none; transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  font-weight: 500;
}
.backup-input:focus { 
  border-color: var(--accent); background: rgba(0,0,0,0.75); 
  box-shadow: 0 0 25px rgba(var(--accent-rgb), 0.25), inset 0 0 10px rgba(var(--accent-rgb), 0.1); 
}
.backup-save-btn {
  display: flex; align-items: center; gap: 10px; padding: 0 24px;
  background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.2), rgba(var(--accent-rgb), 0.1)); 
  color: var(--accent); border: 1px solid rgba(var(--accent-rgb), 0.5); border-radius: 12px;
  font-size: 12px; font-weight: 900; cursor: pointer; transition: 0.4s;
  text-transform: uppercase; letter-spacing: 1.5px;
}
.backup-save-btn:hover { 
  background: var(--accent); color: #000; 
  box-shadow: 0 0 35px var(--accent-glow); transform: translateY(-2px);
}

.backup-list {
  flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px;
}
.backup-list .empty-state { 
  text-align: center; padding: 80px 20px; color: var(--studio-muted); 
  font-size: 14px; font-weight: 700; font-style: italic; opacity: 0.4; letter-spacing: 1px;
}
.backup-item {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; padding: 18px 24px; transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative; overflow: hidden;
}
.backup-item::after {
  content: ''; position: absolute; inset: 0; 
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  transform: translateX(-100%); transition: 0.6s;
}
.backup-item:hover { 
  background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); 
  transform: translateX(8px); box-shadow: 0 15px 40px rgba(0,0,0,0.4); 
}
.backup-item:hover::after { transform: translateX(100%); }

.backup-info { display: flex; flex-direction: column; gap: 6px; position: relative; z-index: 1; }
.backup-name { font-size: 16px; font-weight: 900; color: #fff; letter-spacing: 0.8px; }
.backup-meta { display: flex; align-items: center; gap: 10px; font-size: 11px; color: var(--studio-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.backup-count { color: #fff; font-weight: 800; background: var(--accent); padding: 3px 8px; border-radius: 6px; box-shadow: 0 0 10px var(--accent-glow); }

.backup-actions { display: flex; gap: 10px; position: relative; z-index: 1; }
.backup-action-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 20px; border-radius: 10px; font-size: 11px; font-weight: 900;
  cursor: pointer; transition: 0.4s; text-transform: uppercase; letter-spacing: 1.2px;
}
.backup-action-btn.restore { 
  background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.5); 
}
.backup-action-btn.restore:hover { 
  background: #10b981; color: #000; box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); 
}
.backup-action-btn.delete { 
  padding: 10px 12px; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.5); 
}
.backup-action-btn.delete:hover { 
  background: #ef4444; color: #fff; box-shadow: 0 0 30px rgba(239, 68, 68, 0.6); 
}

/* ── Confirm Modal (LIQUID GLASS ELITE) ── */
.confirm-modal { 
  max-width: 360px; 
  height: auto !important; 
  border-radius: 32px !important; 
  text-align: center; 
  border: 1px solid rgba(255,255,255,0.3) !important;
  box-shadow: 0 50px 150px rgba(0,0,0,0.9), 0 0 40px rgba(var(--accent-rgb), 0.2), inset 0 1px 0 rgba(255,255,255,0.3) !important;
  background: radial-gradient(circle at top, rgba(var(--accent-rgb), 0.1), transparent), rgba(15, 15, 20, 0.98) !important;
  overflow: visible !important;
}
.confirm-modal .modal-head { 
  padding: 30px 20px 15px; 
  background: transparent !important;
  border-bottom: none !important;
}
.confirm-modal .modal-title { 
  justify-content: center; width: 100%; 
  font-size: 16px; font-weight: 900; letter-spacing: 3px;
  text-shadow: 0 0 20px var(--accent-glow);
  color: #fff;
}
.confirm-body { 
  padding: 0 35px 35px; 
  font-size: 14px; font-weight: 600;
  color: rgba(255,255,255,0.75); line-height: 1.6; 
}
.confirm-actions { 
  display: flex; gap: 15px; padding: 24px; 
  border-top: 1px solid rgba(255,255,255,0.1); 
  background: rgba(255,255,255,0.03); 
  border-radius: 0 0 32px 32px;
}
.confirm-btn { 
  flex: 1; padding: 14px; border-radius: 14px; 
  font-size: 12px; font-weight: 950; cursor: pointer; 
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  letter-spacing: 2px; text-transform: uppercase;
}
.confirm-btn.cancel { 
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); 
  color: #fff; opacity: 0.7;
}
.confirm-btn.cancel:hover { 
  background: rgba(255,255,255,0.12); opacity: 1;
  border-color: rgba(255,255,255,0.4);
  transform: scale(1.02);
}
.confirm-btn.proceed { 
  background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.5); 
  color: #ff4d4d; 
}
.confirm-btn.proceed:hover { 
  background: #ef4444; color: #fff; 
  box-shadow: 0 0 35px rgba(239,68,68,0.7);
  transform: scale(1.05) translateY(-2px);
}
</style>
