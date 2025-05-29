import JSZip from 'jszip';
import { Theme } from '@/types';

export interface VSIXOptions {
  publisher?: string;
  version?: string;
  displayName?: string;
  description?: string;
  repository?: string;
  homepage?: string;
  license?: string;
}

export class VSIXExporter {
  private static generatePackageJson(theme: Theme, options: VSIXOptions = {}) {
    const packageJson = {
      name: `vsskin-${theme.id}`,
      displayName: options.displayName || theme.displayName,
      description: options.description || theme.description,
      version: options.version || '1.0.0',
      publisher: options.publisher || 'vsskin',
      engines: {
        vscode: '^1.74.0'
      },
      categories: ['Themes'],
      keywords: [
        'theme',
        'color-theme',
        theme.brand.name.toLowerCase(),
        theme.type,
        ...theme.metadata.tags
      ],
      contributes: {
        themes: [
          {
            label: theme.displayName,
            uiTheme: theme.type === 'dark' ? 'vs-dark' : 'vs',
            path: `./themes/${theme.id}-color-theme.json`
          }
        ]
      },
      repository: options.repository ? {
        type: 'git',
        url: options.repository
      } : undefined,
      homepage: options.homepage,
      license: options.license || 'MIT',
      icon: 'icon.png',
      galleryBanner: {
        color: theme.brand.primaryColor,
        theme: theme.type
      }
    };

    // Remove undefined values
    return JSON.parse(JSON.stringify(packageJson));
  }

  private static generateThemeJson(theme: Theme) {
    return {
      name: theme.displayName,
      type: theme.type,
      semanticHighlighting: true,
      semanticTokenColors: {},
      colors: {
        // Activity Bar
        'activityBar.background': theme.colors['activityBar.background'],
        'activityBar.foreground': theme.colors['activityBar.foreground'],
        'activityBar.inactiveForeground': this.adjustOpacity(theme.colors['activityBar.foreground'], 0.6),
        'activityBar.border': this.adjustColor(theme.colors['activityBar.background'], theme.type === 'dark' ? 20 : -20),
        'activityBarBadge.background': theme.brand.primaryColor,
        'activityBarBadge.foreground': this.getContrastColor(theme.brand.primaryColor),

        // Side Bar
        'sideBar.background': theme.colors['sideBar.background'],
        'sideBar.foreground': theme.colors['sideBar.foreground'],
        'sideBar.border': this.adjustColor(theme.colors['sideBar.background'], theme.type === 'dark' ? 20 : -20),
        'sideBarTitle.foreground': theme.colors['sideBar.foreground'],
        'sideBarSectionHeader.background': this.adjustColor(theme.colors['sideBar.background'], theme.type === 'dark' ? 10 : -10),
        'sideBarSectionHeader.foreground': theme.colors['sideBar.foreground'],

        // Editor
        'editor.background': theme.colors['editor.background'],
        'editor.foreground': theme.colors['editor.foreground'],
        'editorLineNumber.foreground': this.adjustOpacity(theme.colors['editor.foreground'], 0.4),
        'editorLineNumber.activeForeground': this.adjustOpacity(theme.colors['editor.foreground'], 0.8),
        'editorCursor.foreground': theme.brand.primaryColor,
        'editor.selectionBackground': this.adjustOpacity(theme.brand.primaryColor, 0.2),
        'editor.selectionHighlightBackground': this.adjustOpacity(theme.brand.primaryColor, 0.1),
        'editor.wordHighlightBackground': this.adjustOpacity(theme.brand.secondaryColor, 0.1),
        'editor.wordHighlightStrongBackground': this.adjustOpacity(theme.brand.secondaryColor, 0.2),
        'editor.findMatchBackground': this.adjustOpacity(theme.brand.primaryColor, 0.3),
        'editor.findMatchHighlightBackground': this.adjustOpacity(theme.brand.primaryColor, 0.1),
        'editorBracketMatch.background': this.adjustOpacity(theme.brand.primaryColor, 0.2),
        'editorBracketMatch.border': theme.brand.primaryColor,

        // Editor Groups
        'editorGroup.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 20 : -20),
        'editorGroupHeader.tabsBackground': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? -10 : 10),
        'editorGroupHeader.tabsBorder': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 20 : -20),

        // Tabs
        'tab.activeBackground': theme.colors['editor.background'],
        'tab.activeForeground': theme.colors['editor.foreground'],
        'tab.activeBorder': theme.brand.primaryColor,
        'tab.inactiveBackground': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? -10 : 10),
        'tab.inactiveForeground': this.adjustOpacity(theme.colors['editor.foreground'], 0.6),
        'tab.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 20 : -20),

        // Title Bar
        'titleBar.activeBackground': theme.colors['titleBar.activeBackground'],
        'titleBar.activeForeground': theme.colors['titleBar.activeForeground'],
        'titleBar.inactiveBackground': this.adjustColor(theme.colors['titleBar.activeBackground'], theme.type === 'dark' ? -10 : 10),
        'titleBar.inactiveForeground': this.adjustOpacity(theme.colors['titleBar.activeForeground'], 0.6),
        'titleBar.border': this.adjustColor(theme.colors['titleBar.activeBackground'], theme.type === 'dark' ? 20 : -20),

        // Status Bar
        'statusBar.background': theme.colors['statusBar.background'],
        'statusBar.foreground': theme.colors['statusBar.foreground'],
        'statusBar.border': this.adjustColor(theme.colors['statusBar.background'], theme.type === 'dark' ? 20 : -20),
        'statusBar.debuggingBackground': this.adjustColor(theme.brand.secondaryColor, -20),
        'statusBar.debuggingForeground': this.getContrastColor(theme.brand.secondaryColor),
        'statusBar.noFolderBackground': this.adjustColor(theme.colors['statusBar.background'], theme.type === 'dark' ? -10 : 10),

        // Panel
        'panel.background': theme.colors['editor.background'],
        'panel.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 20 : -20),
        'panelTitle.activeForeground': theme.brand.primaryColor,
        'panelTitle.inactiveForeground': this.adjustOpacity(theme.colors['editor.foreground'], 0.6),
        'panelTitle.activeBorder': theme.brand.primaryColor,

        // Terminal
        'terminal.background': theme.colors['editor.background'],
        'terminal.foreground': theme.colors['editor.foreground'],
        'terminal.ansiBlack': theme.type === 'dark' ? '#000000' : '#ffffff',
        'terminal.ansiRed': '#e74c3c',
        'terminal.ansiGreen': '#27ae60',
        'terminal.ansiYellow': '#f39c12',
        'terminal.ansiBlue': '#3498db',
        'terminal.ansiMagenta': '#9b59b6',
        'terminal.ansiCyan': '#1abc9c',
        'terminal.ansiWhite': theme.type === 'dark' ? '#ffffff' : '#000000',

        // Scrollbar
        'scrollbarSlider.background': this.adjustOpacity(theme.colors['editor.foreground'], 0.1),
        'scrollbarSlider.hoverBackground': this.adjustOpacity(theme.colors['editor.foreground'], 0.2),
        'scrollbarSlider.activeBackground': this.adjustOpacity(theme.colors['editor.foreground'], 0.3),

        // Button
        'button.background': theme.brand.primaryColor,
        'button.foreground': this.getContrastColor(theme.brand.primaryColor),
        'button.hoverBackground': this.adjustColor(theme.brand.primaryColor, -10),
        'button.secondaryBackground': this.adjustOpacity(theme.brand.primaryColor, 0.1),
        'button.secondaryForeground': theme.brand.primaryColor,
        'button.secondaryHoverBackground': this.adjustOpacity(theme.brand.primaryColor, 0.2),

        // Input
        'input.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),
        'input.foreground': theme.colors['editor.foreground'],
        'input.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),
        'input.placeholderForeground': this.adjustOpacity(theme.colors['editor.foreground'], 0.5),
        'inputOption.activeBorder': theme.brand.primaryColor,
        'inputValidation.errorBackground': this.adjustOpacity('#e74c3c', 0.1),
        'inputValidation.errorBorder': '#e74c3c',

        // Dropdown
        'dropdown.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),
        'dropdown.foreground': theme.colors['editor.foreground'],
        'dropdown.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),

        // List
        'list.activeSelectionBackground': this.adjustOpacity(theme.brand.primaryColor, 0.2),
        'list.activeSelectionForeground': theme.colors['editor.foreground'],
        'list.hoverBackground': this.adjustOpacity(theme.brand.primaryColor, 0.1),
        'list.inactiveSelectionBackground': this.adjustOpacity(theme.brand.primaryColor, 0.1),
        'list.focusBackground': this.adjustOpacity(theme.brand.primaryColor, 0.15),
        'list.highlightForeground': theme.brand.primaryColor,

        // Tree
        'tree.indentGuidesStroke': this.adjustOpacity(theme.colors['editor.foreground'], 0.2),

        // Badge
        'badge.background': theme.brand.primaryColor,
        'badge.foreground': this.getContrastColor(theme.brand.primaryColor),

        // Progress Bar
        'progressBar.background': theme.brand.primaryColor,

        // Editor Widget
        'editorWidget.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 15 : -15),
        'editorWidget.foreground': theme.colors['editor.foreground'],
        'editorWidget.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),

        // Peek View
        'peekView.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),
        'peekViewEditor.background': theme.colors['editor.background'],
        'peekViewTitle.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 20 : -20),
        'peekViewTitleLabel.foreground': theme.colors['editor.foreground'],

        // Notification
        'notificationCenter.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),
        'notificationCenterHeader.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 15 : -15),
        'notifications.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),
        'notifications.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),
        'notificationLink.foreground': theme.brand.primaryColor,

        // Extensions
        'extensionButton.prominentBackground': theme.brand.primaryColor,
        'extensionButton.prominentForeground': this.getContrastColor(theme.brand.primaryColor),
        'extensionButton.prominentHoverBackground': this.adjustColor(theme.brand.primaryColor, -10),

        // Picklist
        'pickerGroup.foreground': theme.brand.primaryColor,
        'pickerGroup.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),

        // Debug
        'debugToolBar.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 15 : -15),
        'debugToolBar.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),

        // Welcome Page
        'welcomePage.buttonBackground': this.adjustOpacity(theme.brand.primaryColor, 0.1),
        'welcomePage.buttonHoverBackground': this.adjustOpacity(theme.brand.primaryColor, 0.2),
        'walkThrough.embeddedEditorBackground': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 5 : -5),

        // Git
        'gitDecoration.modifiedResourceForeground': '#f39c12',
        'gitDecoration.deletedResourceForeground': '#e74c3c',
        'gitDecoration.untrackedResourceForeground': '#27ae60',
        'gitDecoration.ignoredResourceForeground': this.adjustOpacity(theme.colors['editor.foreground'], 0.4),
        'gitDecoration.conflictingResourceForeground': '#9b59b6',

        // Breadcrumb
        'breadcrumb.background': theme.colors['editor.background'],
        'breadcrumb.foreground': this.adjustOpacity(theme.colors['editor.foreground'], 0.7),
        'breadcrumb.focusForeground': theme.colors['editor.foreground'],
        'breadcrumb.activeSelectionForeground': theme.brand.primaryColor,
        'breadcrumbPicker.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),

        // Menu
        'menu.background': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),
        'menu.foreground': theme.colors['editor.foreground'],
        'menu.selectionBackground': this.adjustOpacity(theme.brand.primaryColor, 0.2),
        'menu.selectionForeground': theme.colors['editor.foreground'],
        'menu.border': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),
        'menubar.selectionBackground': this.adjustOpacity(theme.brand.primaryColor, 0.1),
        'menubar.selectionForeground': theme.colors['editor.foreground'],

        // Settings
        'settings.headerForeground': theme.colors['editor.foreground'],
        'settings.modifiedItemIndicator': theme.brand.primaryColor,
        'settings.dropdownBackground': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),
        'settings.dropdownForeground': theme.colors['editor.foreground'],
        'settings.dropdownBorder': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),
        'settings.checkboxBackground': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),
        'settings.checkboxForeground': theme.colors['editor.foreground'],
        'settings.checkboxBorder': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),
        'settings.textInputBackground': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),
        'settings.textInputForeground': theme.colors['editor.foreground'],
        'settings.textInputBorder': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30),
        'settings.numberInputBackground': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 10 : -10),
        'settings.numberInputForeground': theme.colors['editor.foreground'],
        'settings.numberInputBorder': this.adjustColor(theme.colors['editor.background'], theme.type === 'dark' ? 30 : -30)
      },
      tokenColors: [
        {
          name: 'Comment',
          scope: ['comment', 'punctuation.definition.comment'],
          settings: {
            fontStyle: 'italic',
            foreground: this.adjustOpacity(theme.colors['editor.foreground'], 0.6)
          }
        },
        {
          name: 'Variables',
          scope: ['variable', 'string constant.other.placeholder'],
          settings: {
            foreground: theme.colors['editor.foreground']
          }
        },
        {
          name: 'Colors',
          scope: ['constant.other.color'],
          settings: {
            foreground: theme.brand.secondaryColor
          }
        },
        {
          name: 'Invalid',
          scope: ['invalid', 'invalid.illegal'],
          settings: {
            foreground: '#e74c3c'
          }
        },
        {
          name: 'Keyword, Storage',
          scope: ['keyword', 'storage.type', 'storage.modifier'],
          settings: {
            foreground: theme.brand.primaryColor
          }
        },
        {
          name: 'Operator, Misc',
          scope: [
            'keyword.control',
            'constant.other.color',
            'punctuation',
            'meta.tag',
            'punctuation.definition.tag',
            'punctuation.separator.inheritance.php',
            'punctuation.definition.tag.html',
            'punctuation.definition.tag.begin.html',
            'punctuation.definition.tag.end.html',
            'punctuation.section.embedded',
            'keyword.other.template',
            'keyword.other.substitution'
          ],
          settings: {
            foreground: this.adjustOpacity(theme.colors['editor.foreground'], 0.8)
          }
        },
        {
          name: 'Tag',
          scope: [
            'entity.name.tag',
            'meta.tag.sgml',
            'markup.deleted.git_gutter'
          ],
          settings: {
            foreground: theme.brand.primaryColor
          }
        },
        {
          name: 'Function, Special Method',
          scope: [
            'entity.name.function',
            'meta.function-call',
            'variable.function',
            'support.function',
            'keyword.other.special-method'
          ],
          settings: {
            foreground: theme.brand.secondaryColor
          }
        },
        {
          name: 'Block Level Variables',
          scope: ['meta.block variable.other'],
          settings: {
            foreground: theme.colors['editor.foreground']
          }
        },
        {
          name: 'Other Variable, String Link',
          scope: ['support.other.variable', 'string.other.link'],
          settings: {
            foreground: theme.colors['editor.foreground']
          }
        },
        {
          name: 'Number, Constant, Function Argument, Tag Attribute, Embedded',
          scope: [
            'constant.numeric',
            'constant.language',
            'support.constant',
            'constant.character',
            'constant.escape',
            'variable.parameter',
            'keyword.other.unit',
            'keyword.other'
          ],
          settings: {
            foreground: '#f39c12'
          }
        },
        {
          name: 'String, Symbols, Inherited Class, Markup Heading',
          scope: [
            'string',
            'constant.other.symbol',
            'constant.other.key',
            'entity.other.inherited-class',
            'markup.heading',
            'markup.inserted.git_gutter',
            'meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js'
          ],
          settings: {
            foreground: '#27ae60'
          }
        },
        {
          name: 'Class, Support',
          scope: [
            'entity.name',
            'support.type',
            'support.class',
            'support.other.namespace.use.php',
            'meta.use.php',
            'support.other.namespace.php',
            'markup.changed.git_gutter',
            'support.type.sys-types'
          ],
          settings: {
            foreground: '#3498db'
          }
        },
        {
          name: 'Entity Types',
          scope: ['support.type'],
          settings: {
            foreground: this.adjustOpacity(theme.brand.primaryColor, 0.8)
          }
        },
        {
          name: 'CSS Class and Support',
          scope: [
            'source.css support.type.property-name',
            'source.sass support.type.property-name',
            'source.scss support.type.property-name',
            'source.less support.type.property-name',
            'source.stylus support.type.property-name',
            'source.postcss support.type.property-name'
          ],
          settings: {
            foreground: theme.brand.secondaryColor
          }
        },
        {
          name: 'Sub-methods',
          scope: [
            'entity.name.module.js',
            'variable.import.parameter.js',
            'variable.other.class.js'
          ],
          settings: {
            foreground: '#e74c3c'
          }
        },
        {
          name: 'Language methods',
          scope: ['variable.language'],
          settings: {
            fontStyle: 'italic',
            foreground: '#e74c3c'
          }
        },
        {
          name: 'entity.name.method.js',
          scope: ['entity.name.method.js'],
          settings: {
            fontStyle: 'italic',
            foreground: theme.brand.secondaryColor
          }
        },
        {
          name: 'meta.method.js',
          scope: ['meta.class-method.js entity.name.function.js', 'variable.function.constructor'],
          settings: {
            foreground: theme.brand.secondaryColor
          }
        },
        {
          name: 'Attributes',
          scope: ['entity.other.attribute-name'],
          settings: {
            foreground: '#9b59b6'
          }
        },
        {
          name: 'HTML Attributes',
          scope: [
            'text.html.basic entity.other.attribute-name.html',
            'text.html.basic entity.other.attribute-name'
          ],
          settings: {
            fontStyle: 'italic',
            foreground: '#f39c12'
          }
        },
        {
          name: 'CSS Classes',
          scope: ['entity.other.attribute-name.class'],
          settings: {
            foreground: '#f39c12'
          }
        },
        {
          name: 'CSS ID\'s',
          scope: ['source.sass keyword.control'],
          settings: {
            foreground: theme.brand.secondaryColor
          }
        },
        {
          name: 'Inserted',
          scope: ['markup.inserted'],
          settings: {
            foreground: '#27ae60'
          }
        },
        {
          name: 'Deleted',
          scope: ['markup.deleted'],
          settings: {
            foreground: '#e74c3c'
          }
        },
        {
          name: 'Changed',
          scope: ['markup.changed'],
          settings: {
            foreground: '#9b59b6'
          }
        },
        {
          name: 'Regular Expressions',
          scope: ['string.regexp'],
          settings: {
            foreground: '#1abc9c'
          }
        },
        {
          name: 'Escape Characters',
          scope: ['constant.character.escape'],
          settings: {
            foreground: '#1abc9c'
          }
        },
        {
          name: 'URL',
          scope: ['*url*', '*link*', '*uri*'],
          settings: {
            fontStyle: 'underline'
          }
        },
        {
          name: 'Decorators',
          scope: [
            'tag.decorator.js entity.name.tag.js',
            'tag.decorator.js punctuation.definition.tag.js'
          ],
          settings: {
            fontStyle: 'italic',
            foreground: theme.brand.secondaryColor
          }
        },
        {
          name: 'ES7 Bind Operator',
          scope: [
            'source.js constant.other.object.key.js string.unquoted.label.js'
          ],
          settings: {
            fontStyle: 'italic',
            foreground: '#e74c3c'
          }
        },
        {
          name: 'JSON Key - Level 0',
          scope: [
            'source.json meta.structure.dictionary.json support.type.property-name.json'
          ],
          settings: {
            foreground: '#9b59b6'
          }
        },
        {
          name: 'JSON Key - Level 1',
          scope: [
            'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json'
          ],
          settings: {
            foreground: '#f39c12'
          }
        },
        {
          name: 'JSON Key - Level 2',
          scope: [
            'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json'
          ],
          settings: {
            foreground: '#e74c3c'
          }
        },
        {
          name: 'JSON Key - Level 3',
          scope: [
            'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json'
          ],
          settings: {
            foreground: '#3498db'
          }
        },
        {
          name: 'JSON Key - Level 4',
          scope: [
            'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json'
          ],
          settings: {
            foreground: '#27ae60'
          }
        },
        {
          name: 'JSON Key - Level 5',
          scope: [
            'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json'
          ],
          settings: {
            foreground: '#1abc9c'
          }
        },
        {
          name: 'Markdown - Plain',
          scope: [
            'text.html.markdown',
            'punctuation.definition.list_item.markdown'
          ],
          settings: {
            foreground: theme.colors['editor.foreground']
          }
        },
        {
          name: 'Markdown - Markup Raw Inline',
          scope: ['text.html.markdown markup.inline.raw.markdown'],
          settings: {
            foreground: '#9b59b6'
          }
        },
        {
          name: 'Markdown - Markup Raw Inline Punctuation',
          scope: [
            'text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown'
          ],
          settings: {
            foreground: this.adjustOpacity(theme.colors['editor.foreground'], 0.8)
          }
        },
        {
          name: 'Markdown - Heading',
          scope: [
            'markdown.heading',
            'markup.heading | markup.heading entity.name',
            'markup.heading.markdown punctuation.definition.heading.markdown'
          ],
          settings: {
            foreground: theme.brand.primaryColor
          }
        },
        {
          name: 'Markup - Italic',
          scope: ['markup.italic'],
          settings: {
            fontStyle: 'italic',
            foreground: '#e74c3c'
          }
        },
        {
          name: 'Markup - Bold',
          scope: ['markup.bold', 'markup.bold string'],
          settings: {
            fontStyle: 'bold',
            foreground: '#e74c3c'
          }
        },
        {
          name: 'Markup - Bold-Italic',
          scope: [
            'markup.bold markup.italic',
            'markup.italic markup.bold',
            'markup.quote markup.bold',
            'markup.bold markup.italic string',
            'markup.italic markup.bold string',
            'markup.quote markup.bold string'
          ],
          settings: {
            fontStyle: 'bold',
            foreground: '#e74c3c'
          }
        },
        {
          name: 'Markup - Underline',
          scope: ['markup.underline'],
          settings: {
            fontStyle: 'underline',
            foreground: '#f39c12'
          }
        },
        {
          name: 'Markdown - Blockquote',
          scope: ['markup.quote punctuation.definition.blockquote.markdown'],
          settings: {
            foreground: this.adjustOpacity(theme.colors['editor.foreground'], 0.8)
          }
        },
        {
          name: 'Markup - Quote',
          scope: ['markup.quote'],
          settings: {
            fontStyle: 'italic'
          }
        },
        {
          name: 'Markdown - Link',
          scope: ['string.other.link.title.markdown'],
          settings: {
            foreground: theme.brand.secondaryColor
          }
        },
        {
          name: 'Markdown - Link Description',
          scope: ['string.other.link.description.title.markdown'],
          settings: {
            foreground: '#9b59b6'
          }
        },
        {
          name: 'Markdown - Link Anchor',
          scope: ['constant.other.reference.link.markdown'],
          settings: {
            foreground: '#f39c12'
          }
        },
        {
          name: 'Markup - Raw Block',
          scope: ['markup.raw.block'],
          settings: {
            foreground: '#9b59b6'
          }
        },
        {
          name: 'Markdown - Raw Block Fenced',
          scope: ['markup.raw.block.fenced.markdown'],
          settings: {
            foreground: this.adjustOpacity(theme.colors['editor.foreground'], 0.8)
          }
        },
        {
          name: 'Markdown - Fenced Bode Block',
          scope: ['punctuation.definition.fenced.markdown'],
          settings: {
            foreground: this.adjustOpacity(theme.colors['editor.foreground'], 0.8)
          }
        },
        {
          name: 'Markdown - Fenced Bode Block Variable',
          scope: [
            'markup.raw.block.fenced.markdown',
            'variable.language.fenced.markdown',
            'punctuation.section.class.end'
          ],
          settings: {
            foreground: theme.colors['editor.foreground']
          }
        },
        {
          name: 'Markdown - Fenced Language',
          scope: ['variable.language.fenced.markdown'],
          settings: {
            foreground: this.adjustOpacity(theme.colors['editor.foreground'], 0.8)
          }
        },
        {
          name: 'Markdown - Separator',
          scope: ['meta.separator'],
          settings: {
            fontStyle: 'bold',
            foreground: this.adjustOpacity(theme.colors['editor.foreground'], 0.8)
          }
        },
        {
          name: 'Markup - Table',
          scope: ['markup.table'],
          settings: {
            foreground: theme.colors['editor.foreground']
          }
        }
      ]
    };
  }

  private static generateREADME(theme: Theme, options: VSIXOptions = {}) {
    return `# ${theme.displayName}

${theme.description}

## Preview

A beautiful VS Code theme inspired by ${theme.brand.displayName} brand colors.

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "${theme.displayName}"
4. Click Install

### Manual Installation
1. Download the .vsix file
2. Open VS Code
3. Press Ctrl+Shift+P
4. Type "Extensions: Install from VSIX"
5. Select the downloaded .vsix file

## Activation

1. Press Ctrl+Shift+P
2. Type "Preferences: Color Theme"
3. Select "${theme.displayName}" from the list

## Features

- Beautiful color scheme based on ${theme.brand.displayName}
- Optimized for ${theme.type} mode
- Syntax highlighting for all major languages
- Carefully crafted UI colors for VS Code interface

## Brand Colors

- Primary: \`${theme.brand.primaryColor}\`
- Secondary: \`${theme.brand.secondaryColor}\`

## Tags

${theme.metadata.tags.map(tag => `\`${tag}\``).join(' ')}

## Feedback

If you have any suggestions or issues, please feel free to open an issue on our [GitHub repository](${options.repository || 'https://github.com/vsskin/themes'}).

## License

${options.license || 'MIT'}

---

**Enjoy coding with style!** 🎨
`;
  }

  private static generateCHANGELOG(theme: Theme, options: VSIXOptions = {}) {
    return `# Change Log

All notable changes to the "${theme.displayName}" theme will be documented in this file.

## [${options.version || '1.0.0'}] - ${new Date().toISOString().split('T')[0]}

### Added
- Initial release
- ${theme.type} theme variant
- Syntax highlighting for all major languages
- VS Code UI integration
- Based on ${theme.brand.displayName} brand colors

### Features
- Editor background: \`${theme.colors['editor.background']}\`
- Editor foreground: \`${theme.colors['editor.foreground']}\`
- Primary accent: \`${theme.brand.primaryColor}\`
- Secondary accent: \`${theme.brand.secondaryColor}\`

### Supported Languages
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Rust
- Go
- HTML/CSS
- JSON
- Markdown
- And many more...

---

Generated by VSskin - VS Code Theme Studio
`;
  }

  private static generateIcon(theme: Theme): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('');
        return;
      }

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 128, 128);
      gradient.addColorStop(0, theme.brand.primaryColor);
      gradient.addColorStop(1, theme.brand.secondaryColor);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);

      // Add text
      ctx.fillStyle = this.getContrastColor(theme.brand.primaryColor);
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VS', 64, 64);

      resolve(canvas.toDataURL('image/png'));
    });
  }

  private static adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * amount);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  private static adjustOpacity(hex: string, opacity: number): string {
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return hex + alpha;
  }

  private static getContrastColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  static async exportAsVSIX(theme: Theme, options: VSIXOptions = {}): Promise<Blob> {
    const zip = new JSZip();

    // Add package.json
    zip.file('package.json', JSON.stringify(this.generatePackageJson(theme, options), null, 2));

    // Add theme file
    const themesFolder = zip.folder('themes');
    if (themesFolder) {
      themesFolder.file(`${theme.id}-color-theme.json`, JSON.stringify(this.generateThemeJson(theme), null, 2));
    }

    // Add README.md
    zip.file('README.md', this.generateREADME(theme, options));

    // Add CHANGELOG.md
    zip.file('CHANGELOG.md', this.generateCHANGELOG(theme, options));

    // Add icon
    try {
      const iconDataUrl = await this.generateIcon(theme);
      if (iconDataUrl) {
        const iconBase64 = iconDataUrl.split(',')[1];
        zip.file('icon.png', iconBase64, { base64: true });
      }
    } catch (error) {
      console.warn('Could not generate icon:', error);
    }

    // Generate VSIX file
    return await zip.generateAsync({ type: 'blob' });
  }

  static downloadVSIX(theme: Theme, options: VSIXOptions = {}) {
    this.exportAsVSIX(theme, options).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vsskin-${theme.id}-${options.version || '1.0.0'}.vsix`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }
}
