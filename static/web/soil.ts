/**
 * Set of helper functions to facilitate the work with HTML elements, specially their creation.
 *
 * NOTE The following functions silently depend on the `document` variable being globally available. Therefore, unit
 * tests of components that use them must be run inside a browser, or must expose `document` globally, e.g. through
 * PhantomJS or jsdom.
 *
 * The HTML elements considered below are based on the TypeScript (2.6.2) interface `ElementTagNameMap` and its
 * ascendants, on the list of void, raw text and other special elements present in [The HTML syntax](https://www.w3.org/TR/html51/syntax.html#writing-html-documents-elements)
 * by the W3C, and on MDN's list of [Obsolete and deprecated elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Obsolete_and_deprecated_elements).
 * Non-standard elements, such as `<x-ms-webview>`, are also excluded.
 */
type DeepPartial<T> = {} | T
type Svg = any

function assignProperties<E extends Element, P extends DeepPartial<E>>(elem: E, props: P): void {
    for (const p in props) {
        if (props.hasOwnProperty(p)) {
            if (isObject(props[p])) {
                // Go deeper, for properties such as `style`.
                assignNestedProperties((elem as any)[p], props[p] as any)
            } else {
                if (p.indexOf('-') > -1) {
                    // Deal with custom and special attributes, such as `data-*` and `aria-*` attributes.
                    elem.setAttribute(p, props[p] as any)
                } else {
                    // Treat the rest as standard properties.
                    (elem as any)[p] = props[p]
                }
            }
        }
    }
}

function assignNestedProperties(target: { [key: string]: any }, props: { [key: string]: any }) {
    for (const p in props) {
        if (props.hasOwnProperty(p)) {
            if (isObject(props[p])) {
                // Some SVG properties are even more nested.
                assignNestedProperties(target[p], props[p])
            } else {
                target[p] = props[p]
            }
        }
    }
}

function isObject(o: any): boolean {
    return o instanceof Object && (o as Object).constructor === Object
}



//import {assignProperties} from './assignProperties'
//import {DeepPartial} from '../extra/DeepPartial'
//import {Svg} from './s'

/**
 * Types added manually as they are not yet present in TypeScript (2.6.2) but they are listed in W3Schools' list of
 * [HTML5 New Elements](https://www.w3schools.com/html/html5_new_elements.asp).
 *
 * TODO Follow up [TypeScript issue #17828](https://github.com/Microsoft/TypeScript/issues/17828).
 */
export type HTMLDetailsElement = HTMLElement & { open: boolean }
export type HTMLDialogElement = HTMLElement & { open: boolean }

/**
 * List of all HTML tag names.
 */
export type HTMLTag
    = 'a'
    | 'abbr'
    | 'address'
    | 'area'
    | 'article'
    | 'aside'
    | 'audio'
    | 'b'
    | 'base'
    | 'bdi'
    | 'bdo'
    | 'blockquote'
    | 'body'
    | 'br'
    | 'button'
    | 'canvas'
    | 'caption'
    | 'cite'
    | 'code'
    | 'col'
    | 'colgroup'
    | 'data'
    | 'datalist'
    | 'dd'
    | 'del'
    | 'details'
    | 'dfn'
    | 'dialog'
    | 'div'
    | 'dl'
    | 'dt'
    | 'em'
    | 'embed'
    | 'fieldset'
    | 'figcaption'
    | 'figure'
    | 'footer'
    | 'form'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'head'
    | 'header'
    | 'hr'
    | 'html'
    | 'i'
    | 'iframe'
    | 'img'
    | 'input'
    | 'ins'
    | 'kbd'
    | 'label'
    | 'legend'
    | 'li'
    | 'link'
    | 'main'
    | 'map'
    | 'mark'
    | 'meta'
    | 'meter'
    | 'nav'
    | 'noscript'
    | 'object'
    | 'ol'
    | 'optgroup'
    | 'option'
    | 'output'
    | 'p'
    | 'param'
    | 'picture'
    | 'pre'
    | 'progress'
    | 'q'
    | 'rp'
    | 'rt'
    | 'ruby'
    | 's'
    | 'samp'
    | 'script'
    | 'section'
    | 'select'
    | 'small'
    | 'source'
    | 'span'
    | 'strong'
    | 'style'
    | 'sub'
    | 'summary'
    | 'sup'
    | 'table'
    | 'tbody'
    | 'td'
    | 'template'
    | 'textarea'
    | 'tfoot'
    | 'th'
    | 'thead'
    | 'time'
    | 'title'
    | 'tr'
    | 'track'
    | 'u'
    | 'ul'
    | 'var'
    | 'video'
    | 'wbr'

/**
 * Aliases for HTML element types, whose native counterparts are not always easy to guess or find.
 *
 * Notice that some elements do not have a specific interface to define them, and they resort to a more generic one,
 * e.g. `Ul` (unordered list) is well-defined by `HTMLUListElement`, but `B` (bold) simply delegates to `HTMLElement`.
 */
export type A = HTMLAnchorElement
export type Abbr = HTMLElement
export type Address = HTMLElement
export type Area = HTMLAreaElement
export type Article = HTMLElement
export type Aside = HTMLElement
export type Audio = HTMLAudioElement
export type B = HTMLElement
export type Base = HTMLBaseElement
export type Bdi = HTMLElement
export type Bdo = HTMLElement
export type Blockquote = HTMLQuoteElement
export type Body = HTMLBodyElement
export type Br = HTMLBRElement
export type Button = HTMLButtonElement
export type Canvas = HTMLCanvasElement
export type Caption = HTMLTableCaptionElement
export type Cite = HTMLElement
export type Code = HTMLElement
export type Col = HTMLTableColElement
export type Colgroup = HTMLTableColElement
export type Data = HTMLDataElement
export type Datalist = HTMLDataListElement
export type Dd = HTMLElement
export type Del = HTMLModElement
export type Details = HTMLDetailsElement
export type Dfn = HTMLElement
export type Dialog = HTMLDialogElement
export type Div = HTMLDivElement
export type Dl = HTMLDListElement
export type Dt = HTMLElement
export type Em = HTMLElement
export type Embed = HTMLEmbedElement
export type Fieldset = HTMLFieldSetElement
export type Figcaption = HTMLElement
export type Figure = HTMLElement
export type Footer = HTMLElement
export type Form = HTMLFormElement
export type H1 = HTMLHeadingElement
export type H2 = HTMLHeadingElement
export type H3 = HTMLHeadingElement
export type H4 = HTMLHeadingElement
export type H5 = HTMLHeadingElement
export type H6 = HTMLHeadingElement
export type Head = HTMLHeadElement
export type Header = HTMLElement
export type Hr = HTMLHRElement
export type Html = HTMLHtmlElement
export type I = HTMLElement
export type Iframe = HTMLIFrameElement
export type Img = HTMLImageElement
export type Input = HTMLInputElement
export type Ins = HTMLModElement
export type Kbd = HTMLElement
export type Label = HTMLLabelElement
export type Legend = HTMLLegendElement
export type Li = HTMLLIElement
export type Link = HTMLLinkElement
export type Main = HTMLElement
export type Map = HTMLMapElement
export type Mark = HTMLElement
export type Meta = HTMLMetaElement
export type Meter = HTMLMeterElement
export type Nav = HTMLElement
export type Noscript = HTMLElement
export type Object = HTMLObjectElement
export type Ol = HTMLOListElement
export type Optgroup = HTMLOptGroupElement
export type Option = HTMLOptionElement
export type Output = HTMLOutputElement
export type P = HTMLParagraphElement
export type Param = HTMLParamElement
export type Picture = HTMLPictureElement
export type Pre = HTMLPreElement
export type Progress = HTMLProgressElement
export type Q = HTMLQuoteElement
export type Rp = HTMLElement
export type Rt = HTMLElement
export type Ruby = HTMLElement
export type S = HTMLElement
export type Samp = HTMLElement
export type Script = HTMLScriptElement
export type Section = HTMLElement
export type Select = HTMLSelectElement
export type Small = HTMLElement
export type Source = HTMLSourceElement
export type Span = HTMLSpanElement
export type Strong = HTMLElement
export type Style = HTMLStyleElement
export type Sub = HTMLElement
export type Summary = HTMLElement
export type Sup = HTMLElement
export type Table = HTMLTableElement
export type Tbody = HTMLTableSectionElement
export type Td = HTMLTableDataCellElement
export type Template = HTMLTemplateElement
export type Textarea = HTMLTextAreaElement
export type Tfoot = HTMLTableSectionElement
export type Th = HTMLTableHeaderCellElement
export type Thead = HTMLTableSectionElement
export type Time = HTMLTimeElement
export type Title = HTMLTitleElement
export type Tr = HTMLTableRowElement
export type Track = HTMLTrackElement
export type U = HTMLElement
export type Ul = HTMLUListElement
export type Var = HTMLElement
export type Video = HTMLVideoElement
export type Wbr = HTMLElement

/**
 * Map from HTML tag names to their corresponding types.
 */
export interface HTMLTagMap {
    a: A
    abbr: Abbr
    address: Address
    area: Area
    article: Article
    aside: Aside
    audio: Audio
    b: B
    base: Base
    bdi: Bdi
    bdo: Bdo
    blockquote: Blockquote
    body: Body
    br: Br
    button: Button
    canvas: Canvas
    caption: Caption
    cite: Cite
    code: Code
    col: Col
    colgroup: Colgroup
    data: Data
    datalist: Datalist
    dd: Dd
    del: Del
    details: Details
    dfn: Dfn
    dialog: Dialog
    div: Div
    dl: Dl
    dt: Dt
    em: Em
    embed: Embed
    fieldset: Fieldset
    figcaption: Figcaption
    figure: Figure
    footer: Footer
    form: Form
    h1: H1
    h2: H2
    h3: H3
    h4: H4
    h5: H5
    h6: H6
    head: Head
    header: Header
    hr: Hr
    html: Html
    i: I
    iframe: Iframe
    img: Img
    input: Input
    ins: Ins
    kbd: Kbd
    label: Label
    legend: Legend
    li: Li
    link: Link
    main: Main
    map: Map
    mark: Mark
    meta: Meta
    meter: Meter
    nav: Nav
    noscript: Noscript
    object: Object
    ol: Ol
    optgroup: Optgroup
    option: Option
    output: Output
    p: P
    param: Param
    picture: Picture
    pre: Pre
    progress: Progress
    q: Q
    rp: Rp
    rt: Rt
    ruby: Ruby
    s: S
    samp: Samp
    script: Script
    section: Section
    select: Select
    small: Small
    source: Source
    span: Span
    strong: Strong
    style: Style
    sub: Sub
    summary: Summary
    sup: Sup
    table: Table
    tbody: Tbody
    td: Td
    template: Template
    textarea: Textarea
    tfoot: Tfoot
    th: Th
    thead: Thead
    time: Time
    title: Title
    tr: Tr
    track: Track
    u: U
    ul: Ul
    var: Var
    video: Video
    wbr: Wbr
    [customTag: string]: HTMLElement
}

/**
 * Allowed types for the children of HTML elements, if they accept them and don't have special constraints.
 */
export type HTMLChildren = string | (HTMLElement | Svg | string)[]

/**
 * Allowed types for the properties of HTML elements.
 */
export type HTMLProperties<E extends HTMLElement = HTMLElement> = DeepPartial<E> & { [prop: string]: any }

/**
 * Helper function to concisely create instances of any HTML element, including custom ones.
 */
export function h<K extends keyof HTMLTagMap>(name: K, props?: HTMLProperties<HTMLTagMap[K]>, children?: HTMLChildren): HTMLTagMap[K] {
    const elem: HTMLTagMap[K] = document.createElement(name)

    if (props !== undefined) {
        assignProperties<HTMLTagMap[K], HTMLProperties<HTMLTagMap[K]>>(elem, props)
    }

    if (children !== undefined) {
        if (typeof children === 'string') {
            elem.appendChild(document.createTextNode(children))
        } else {
            children.forEach(child => elem.appendChild(
                typeof child === 'string'
                    ? document.createTextNode(child)
                    : child
            ))
        }
    }

    return elem
}

/**
 * HTML element content categories, extracted from https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories
 * (deprecated, experimental or poorly-supported elements are excluded).
 */
export namespace HTMLContent {

    export type Metadata = (Base | Link | Meta | Noscript | Script | Style | Title)[]

    export type FlowItems = A | Abbr | Address | Article | Aside | Audio | B | Bdo | Bdi | Blockquote | Br | Button | Canvas | Cite | Code | Data | Datalist | Del | Details | Dfn | Div | Dl | Em | Embed | Fieldset | Figure | Footer | Form | H1 | H2 | H3 | H4 | H5 | H6 | Header | Hr | I | Iframe | Img | Input | Ins | Kbd | Label | Main | Map | Mark | Meter | Nav | Noscript | Object | Ol | Output | P | Pre | Progress | Q | Ruby | S | Samp | Script | Section | Select | Small | Span | Strong | Sub | Sup | Svg | Table | Template | Textarea | Time | Ul | Var | Video | Wbr | Area | Link | Meta | string
    export type Flow = HTMLContent.FlowItems[] | string

    export type Sectioning = (Article | Aside | Nav | Section)[]

    export type HeadingItems = H1 | H2 | H3 | H4 | H5 | H6
    export type Heading = HTMLContent.HeadingItems[]

    export type PhrasingItems = Abbr | Audio | B | Bdo | Br | Button | Canvas | Cite | Code | Data | Datalist | Dfn | Em | Embed | I | Iframe | Img | Input | Kbd | Label | Mark | Meter | Noscript | Object | Output | Progress | Q | Ruby | Samp | Script | Select | Small | Span | Strong | Sub | Sup | Svg | Textarea | Time | Var | Video | Wbr | A | Area | Del | Ins | Link | Map | Meta | string
    export type Phrasing = PhrasingItems[] | string

    export type Embedded = (Audio | Canvas | Embed | Iframe | Img | Object | Svg | Video)[]

    export type Interactive = (A | Button | Details | Embed | Iframe | Label | Select | Textarea | Audio | Img | Input | Object | Video)[]

    export type Palpable = HTMLChildren

    export type FormAssociated = (Button | Fieldset | Input | Label | Meter | Object | Output | Progress | Select | Textarea)[]
    export type FormAssociatedListed = (Button | Fieldset | Input | Object | Output | Select | Textarea)[]
    export type FormAssociatedLabelable = (Button | Input | Meter | Output | Progress | Select | Textarea)[]
    export type FormAssociatedSubmittable = (Button | Input | Object | Select | Textarea)[]
    export type FormAssociatedResettable = (Input | Output | Select | Textarea)[]

    export type ScriptSupportingItems = Script | Template
    export type ScriptSupporting = HTMLContent.ScriptSupportingItems[]

    export type Transparent = HTMLChildren
}

/**
 * Type aliases for the accepted children of all HTML elements.
 */
export namespace Children {

    // Type aliases for all HTML elements, as a way to access them within the namespace without naming conflicts.
    export type _A = HTMLTagMap['a']
    export type _Abbr = HTMLTagMap['abbr']
    export type _Address = HTMLTagMap['address']
    export type _Area = HTMLTagMap['area']
    export type _Article = HTMLTagMap['article']
    export type _Aside = HTMLTagMap['aside']
    export type _Audio = HTMLTagMap['audio']
    export type _B = HTMLTagMap['b']
    export type _Base = HTMLTagMap['base']
    export type _Bdi = HTMLTagMap['bdi']
    export type _Bdo = HTMLTagMap['bdo']
    export type _Blockquote = HTMLTagMap['blockquote']
    export type _Body = HTMLTagMap['body']
    export type _Br = HTMLTagMap['br']
    export type _Button = HTMLTagMap['button']
    export type _Canvas = HTMLTagMap['canvas']
    export type _Caption = HTMLTagMap['caption']
    export type _Cite = HTMLTagMap['cite']
    export type _Code = HTMLTagMap['code']
    export type _Col = HTMLTagMap['col']
    export type _Colgroup = HTMLTagMap['colgroup']
    export type _Data = HTMLTagMap['data']
    export type _Datalist = HTMLTagMap['datalist']
    export type _Dd = HTMLTagMap['dd']
    export type _Del = HTMLTagMap['del']
    export type _Details = HTMLTagMap['details']
    export type _Dfn = HTMLTagMap['dfn']
    export type _Dialog = HTMLTagMap['dialog']
    export type _Div = HTMLTagMap['div']
    export type _Dl = HTMLTagMap['dl']
    export type _Dt = HTMLTagMap['dt']
    export type _Em = HTMLTagMap['em']
    export type _Embed = HTMLTagMap['embed']
    export type _Fieldset = HTMLTagMap['fieldset']
    export type _Figcaption = HTMLTagMap['figcaption']
    export type _Figure = HTMLTagMap['figure']
    export type _Footer = HTMLTagMap['footer']
    export type _Form = HTMLTagMap['form']
    export type _H1 = HTMLTagMap['h1']
    export type _H2 = HTMLTagMap['h2']
    export type _H3 = HTMLTagMap['h3']
    export type _H4 = HTMLTagMap['h4']
    export type _H5 = HTMLTagMap['h5']
    export type _H6 = HTMLTagMap['h6']
    export type _Head = HTMLTagMap['head']
    export type _Header = HTMLTagMap['header']
    export type _Hr = HTMLTagMap['hr']
    export type _Html = HTMLTagMap['html']
    export type _I = HTMLTagMap['i']
    export type _Iframe = HTMLTagMap['iframe']
    export type _Img = HTMLTagMap['img']
    export type _Input = HTMLTagMap['input']
    export type _Ins = HTMLTagMap['ins']
    export type _Kbd = HTMLTagMap['kbd']
    export type _Label = HTMLTagMap['label']
    export type _Legend = HTMLTagMap['legend']
    export type _Li = HTMLTagMap['li']
    export type _Link = HTMLTagMap['link']
    export type _Main = HTMLTagMap['main']
    export type _Map = HTMLTagMap['map']
    export type _Mark = HTMLTagMap['mark']
    export type _Meta = HTMLTagMap['meta']
    export type _Meter = HTMLTagMap['meter']
    export type _Nav = HTMLTagMap['nav']
    export type _Noscript = HTMLTagMap['noscript']
    export type _Object = HTMLTagMap['object']
    export type _Ol = HTMLTagMap['ol']
    export type _Optgroup = HTMLTagMap['optgroup']
    export type _Option = HTMLTagMap['option']
    export type _Output = HTMLTagMap['output']
    export type _P = HTMLTagMap['p']
    export type _Param = HTMLTagMap['param']
    export type _Picture = HTMLTagMap['picture']
    export type _Pre = HTMLTagMap['pre']
    export type _Progress = HTMLTagMap['progress']
    export type _Q = HTMLTagMap['q']
    export type _Rp = HTMLTagMap['rp']
    export type _Rt = HTMLTagMap['rt']
    export type _Ruby = HTMLTagMap['ruby']
    export type _S = HTMLTagMap['s']
    export type _Samp = HTMLTagMap['samp']
    export type _Script = HTMLTagMap['script']
    export type _Section = HTMLTagMap['section']
    export type _Select = HTMLTagMap['select']
    export type _Small = HTMLTagMap['small']
    export type _Source = HTMLTagMap['source']
    export type _Span = HTMLTagMap['span']
    export type _Strong = HTMLTagMap['strong']
    export type _Style = HTMLTagMap['style']
    export type _Sub = HTMLTagMap['sub']
    export type _Summary = HTMLTagMap['summary']
    export type _Sup = HTMLTagMap['sup']
    export type _Table = HTMLTagMap['table']
    export type _Tbody = HTMLTagMap['tbody']
    export type _Td = HTMLTagMap['td']
    export type _Template = HTMLTagMap['template']
    export type _Textarea = HTMLTagMap['textarea']
    export type _Tfoot = HTMLTagMap['tfoot']
    export type _Th = HTMLTagMap['th']
    export type _Thead = HTMLTagMap['thead']
    export type _Time = HTMLTagMap['time']
    export type _Title = HTMLTagMap['title']
    export type _Tr = HTMLTagMap['tr']
    export type _Track = HTMLTagMap['track']
    export type _U = HTMLTagMap['u']
    export type _Ul = HTMLTagMap['ul']
    export type _Var = HTMLTagMap['var']
    export type _Video = HTMLTagMap['video']
    export type _Wbr = HTMLTagMap['wbr']

    // Actual type aliases for the HTML children.
    export type A = HTMLContent.Transparent
    export type Abbr = HTMLContent.Phrasing
    export type Address = HTMLContent.Flow
    export type Area = void
    export type Article = HTMLContent.Flow
    export type Aside = HTMLContent.Flow
    export type Audio = HTMLContent.Transparent
    export type B = HTMLContent.Phrasing
    export type Base = void
    export type Bdi = HTMLContent.Phrasing
    export type Bdo = HTMLContent.Phrasing
    export type Blockquote = HTMLContent.Flow
    export type Body = HTMLContent.Flow
    export type Br = void
    export type Button = HTMLContent.Phrasing
    export type Canvas = HTMLContent.Transparent
    export type Caption = HTMLContent.Flow
    export type Cite = HTMLContent.Phrasing
    export type Code = HTMLContent.Phrasing
    export type Col = void
    export type Colgroup = _Col[]
    export type Data = HTMLContent.Phrasing
    export type Datalist = HTMLContent.Phrasing | _Option[]
    export type Dd = HTMLContent.Flow
    export type Del = HTMLContent.Transparent
    export type Details = (_Summary | HTMLContent.FlowItems)[] | string
    export type Dfn = HTMLContent.Phrasing
    export type Dialog = HTMLContent.Flow
    export type Div = (HTMLContent.FlowItems | _Dt | _Dd | _Script | _Template)[] | string
    export type Dl = (_Dt | _Dd | _Script | _Template | _Div)[]
    export type Dt = HTMLContent.Flow
    export type Em = HTMLContent.Phrasing
    export type Embed = void
    export type Fieldset = (_Legend | HTMLContent.FlowItems)[] | string
    export type Figcaption = HTMLContent.Flow
    export type Figure = (_Figcaption | HTMLContent.FlowItems)[] | string
    export type Footer = HTMLContent.Flow
    export type Form = HTMLContent.Flow
    export type H1 = HTMLContent.Phrasing
    export type H2 = HTMLContent.Phrasing
    export type H3 = HTMLContent.Phrasing
    export type H4 = HTMLContent.Phrasing
    export type H5 = HTMLContent.Phrasing
    export type H6 = HTMLContent.Phrasing
    export type Head = HTMLContent.Metadata
    export type Header = HTMLContent.Flow
    export type Hr = void
    export type Html = [_Head, _Body] | [_Head] | [_Body]
    export type I = HTMLContent.Phrasing
    export type Iframe = HTMLChildren
    export type Img = void
    export type Input = void
    export type Ins = HTMLContent.Transparent
    export type Kbd = HTMLContent.Phrasing
    export type Label = HTMLContent.Phrasing
    export type Legend = HTMLContent.Phrasing
    export type Li = HTMLContent.Flow
    export type Link = void
    export type Main = HTMLContent.Flow
    export type Map = HTMLContent.Transparent
    export type Mark = HTMLContent.Phrasing
    export type Meta = void
    export type Meter = HTMLContent.Phrasing
    export type Nav = HTMLContent.Flow
    export type Noscript = HTMLChildren
    export type Object = HTMLContent.Transparent
    export type Ol = _Li[]
    export type Optgroup = _Option[]
    export type Option = string
    export type Output = HTMLContent.Phrasing
    export type P = HTMLContent.Phrasing
    export type Param = void
    export type Picture = (_Source | _Img | HTMLContent.ScriptSupportingItems)[]
    export type Pre = HTMLContent.Phrasing
    export type Progress = HTMLContent.Phrasing
    export type Q = HTMLContent.Phrasing
    export type Rp = string
    export type Rt = HTMLContent.Phrasing
    export type Ruby = HTMLContent.Phrasing
    export type S = HTMLContent.Phrasing
    export type Samp = HTMLContent.Phrasing
    export type Script = string
    export type Section = HTMLContent.Flow
    export type Select = (_Option | _Optgroup)[]
    export type Small = HTMLContent.Phrasing
    export type Source = void
    export type Span = HTMLContent.Phrasing
    export type Strong = HTMLContent.Phrasing
    export type Style = string
    export type Sub = HTMLContent.Phrasing
    export type Summary = HTMLContent.Phrasing | [HTMLContent.HeadingItems]
    export type Sup = HTMLContent.Phrasing
    export type Table = (_Caption | _Colgroup | _Thead | _Tbody | _Tfoot)[] | (_Caption | _Colgroup | _Thead | _Tr | _Tfoot)[]
    export type Tbody = _Tr[]
    export type Td = HTMLContent.Flow
    export type Template = HTMLChildren
    export type Textarea = string
    export type Tfoot = _Tr[]
    export type Th = HTMLContent.Flow
    export type Thead = _Tr[]
    export type Time = HTMLContent.Phrasing
    export type Title = string
    export type Tr = (_Td | _Th | HTMLContent.ScriptSupportingItems)[]
    export type Track = void
    export type U = HTMLContent.Phrasing
    export type Ul = _Li[]
    export type Var = HTMLContent.Phrasing
    export type Video = HTMLContent.Transparent
    export type Wbr = void
}

/**
 * Helpers to allow creating any concrete HTML element in a more concise manner.
 *
 * The types of these are almost always stricter than those of `h()`, e.g. `br()` does not accept children, `ul()`
 * accepts only `Li` children.
 *
 * TODO Once TypeScript's `Exclude` is available, some of the types of `children` can be even stricter.
 */
export const a = (props?: DeepPartial<A>, children?: Children.A): A => h('a', props, children)
export const abbr = (props?: DeepPartial<Abbr>, children?: Children.Abbr): Abbr => h('abbr', props, children)
export const address = (props?: DeepPartial<Address>, children?: Children.Address): Address => h('address', props, children)
export const area = (props?: DeepPartial<Area>): Area => h('area', props)
export const article = (props?: DeepPartial<Article>, children?: Children.Article): Article => h('article', props, children)
export const aside = (props?: DeepPartial<Aside>, children?: Children.Aside): Aside => h('aside', props, children)
export const audio = (props?: DeepPartial<Audio>, children?: Children.Audio): Audio => h('audio', props, children)
export const b = (props?: DeepPartial<B>, children?: Children.B): B => h('b', props, children)
export const base = (props?: DeepPartial<Base>): Base => h('base', props)
export const bdi = (props?: DeepPartial<Bdi>, children?: Children.Bdi): Bdi => h('bdi', props, children)
export const bdo = (props?: DeepPartial<Bdo>, children?: Children.Bdo): Bdo => h('bdo', props, children)
export const blockquote = (props?: DeepPartial<Blockquote>, children?: Children.Blockquote): Blockquote => h('blockquote', props, children)
export const body = (props?: DeepPartial<Body>, children?: Children.Body): Body => h('body', props, children)
export const br = (props?: DeepPartial<Br>): Br => h('br', props)
export const button = (props?: DeepPartial<Button>, children?: Children.Button): Button => h('button', props, children)
export const canvas = (props?: DeepPartial<Canvas>, children?: Children.Canvas): Canvas => h('canvas', props, children)
export const caption = (props?: DeepPartial<Caption>, children?: Children.Caption): Caption => h('caption', props, children)
export const cite = (props?: DeepPartial<Cite>, children?: Children.Cite): Cite => h('cite', props, children)
export const code = (props?: DeepPartial<Code>, children?: Children.Code): Code => h('code', props, children)
export const col = (props?: DeepPartial<Col>): Col => h('col', props)
export const colgroup = (props?: DeepPartial<Colgroup>, children?: Children.Colgroup): Colgroup => h('colgroup', props, children)
export const data = (props?: DeepPartial<Data>, children?: Children.Data): Data => h('data', props, children)
export const datalist = (props?: DeepPartial<Datalist>, children?: Children.Datalist): Datalist => h('datalist', props, children)
export const dd = (props?: DeepPartial<Dd>, children?: Children.Dd): Dd => h('dd', props, children)
export const del = (props?: DeepPartial<Del>, children?: Children.Del): Del => h('del', props, children)
export const details = (props?: DeepPartial<Details>, children?: Children.Details): Details => h('details', props, children)
export const dfn = (props?: DeepPartial<Dfn>, children?: Children.Dfn): Dfn => h('dfn', props, children)
export const dialog = (props?: DeepPartial<Dialog>, children?: Children.Dialog): Dialog => h('dialog', props, children)
export const div = (props?: DeepPartial<Div>, children?: Children.Div): Div => h('div', props, children)
export const dl = (props?: DeepPartial<Dl>, children?: Children.Dl): Dl => h('dl', props, children)
export const dt = (props?: DeepPartial<Dt>, children?: Children.Dt): Dt => h('dt', props, children)
export const em = (props?: DeepPartial<Em>, children?: Children.Em): Em => h('em', props, children)
export const embed = (props?: DeepPartial<Embed>): Embed => h('embed', props)
export const fieldset = (props?: DeepPartial<Fieldset>, children?: Children.Fieldset): Fieldset => h('fieldset', props, children)
export const figcaption = (props?: DeepPartial<Figcaption>, children?: Children.Figcaption): Figcaption => h('figcaption', props, children)
export const figure = (props?: DeepPartial<Figure>, children?: Children.Figure): Figure => h('figure', props, children)
export const footer = (props?: DeepPartial<Footer>, children?: Children.Footer): Footer => h('footer', props, children)
export const form = (props?: DeepPartial<Form>, children?: Children.Form): Form => h('form', props, children)
export const h1 = (props?: DeepPartial<H1>, children?: Children.H1): H1 => h('h1', props, children)
export const h2 = (props?: DeepPartial<H2>, children?: Children.H2): H2 => h('h2', props, children)
export const h3 = (props?: DeepPartial<H3>, children?: Children.H3): H3 => h('h3', props, children)
export const h4 = (props?: DeepPartial<H4>, children?: Children.H4): H4 => h('h4', props, children)
export const h5 = (props?: DeepPartial<H5>, children?: Children.H5): H5 => h('h5', props, children)
export const h6 = (props?: DeepPartial<H6>, children?: Children.H6): H6 => h('h6', props, children)
export const head = (props?: DeepPartial<Head>, children?: Children.Head): Head => h('head', props, children)
export const header = (props?: DeepPartial<Header>, children?: Children.Header): Header => h('header', props, children)
export const hr = (props?: DeepPartial<Hr>): Hr => h('hr', props)
export const html = (props?: DeepPartial<Html>, children?: Children.Html): Html => h('html', props, children)
export const i = (props?: DeepPartial<I>, children?: Children.I): I => h('i', props, children)
export const iframe = (props?: DeepPartial<Iframe>, children?: Children.Iframe): Iframe => h('iframe', props, children)
export const img = (props?: DeepPartial<Img>): Img => h('img', props)
export const input = (props?: DeepPartial<Input>): Input => h('input', props)
export const ins = (props?: DeepPartial<Ins>, children?: Children.Ins): Ins => h('ins', props, children)
export const kbd = (props?: DeepPartial<Kbd>, children?: Children.Kbd): Kbd => h('kbd', props, children)
export const label = (props?: DeepPartial<Label>, children?: Children.Label): Label => h('label', props, children)
export const legend = (props?: DeepPartial<Legend>, children?: Children.Legend): Legend => h('legend', props, children)
export const li = (props?: DeepPartial<Li>, children?: Children.Li): Li => h('li', props, children)
export const link = (props?: DeepPartial<Link>): Link => h('link', props)
export const main = (props?: DeepPartial<Main>, children?: Children.Main): Main => h('main', props, children)
export const map = (props?: DeepPartial<Map>, children?: Children.Map): Map => h('map', props, children)
export const mark = (props?: DeepPartial<Mark>, children?: Children.Mark): Mark => h('mark', props, children)
export const meta = (props?: DeepPartial<Meta>): Meta => h('meta', props)
export const meter = (props?: DeepPartial<Meter>, children?: Children.Meter): Meter => h('meter', props, children)
export const nav = (props?: DeepPartial<Nav>, children?: Children.Nav): Nav => h('nav', props, children)
export const noscript = (props?: DeepPartial<Noscript>, children?: Children.Noscript): Noscript => h('noscript', props, children)
export const object = (props?: DeepPartial<Object>, children?: Children.Object): Object => h('object', props, children)
export const ol = (props?: DeepPartial<Ol>, children?: Children.Ol): Ol => h('ol', props, children)
export const optgroup = (props?: DeepPartial<Optgroup>, children?: Children.Optgroup): Optgroup => h('optgroup', props, children)
export const option = (props?: DeepPartial<Option>, children?: Children.Option): Option => h('option', props, children)
export const output = (props?: DeepPartial<Output>, children?: Children.Output): Output => h('output', props, children)
export const p = (props?: DeepPartial<P>, children?: Children.P): P => h('p', props, children)
export const param = (props?: DeepPartial<Param>): Param => h('param', props)
export const picture = (props?: DeepPartial<Picture>, children?: Children.Picture): Picture => h('picture', props, children)
export const pre = (props?: DeepPartial<Pre>, children?: Children.Pre): Pre => h('pre', props, children)
export const progress = (props?: DeepPartial<Progress>, children?: Children.Progress): Progress => h('progress', props, children)
export const q = (props?: DeepPartial<Q>, children?: Children.Q): Q => h('q', props, children)
export const rp = (props?: DeepPartial<Rp>, children?: Children.Rp): Rp => h('rp', props, children)
export const rt = (props?: DeepPartial<Rt>, children?: Children.Rt): Rt => h('rt', props, children)
export const ruby = (props?: DeepPartial<Ruby>, children?: Children.Ruby): Ruby => h('ruby', props, children)
export const s = (props?: DeepPartial<S>, children?: Children.S): S => h('s', props, children)
export const samp = (props?: DeepPartial<Samp>, children?: Children.Samp): Samp => h('samp', props, children)
export const script = (props?: DeepPartial<Script>, children?: Children.Script): Script => h('script', props, children)
export const section = (props?: DeepPartial<Section>, children?: Children.Section): Section => h('section', props, children)
export const select = (props?: DeepPartial<Select>, children?: Children.Select): Select => h('select', props, children)
export const small = (props?: DeepPartial<Small>, children?: Children.Small): Small => h('small', props, children)
export const source = (props?: DeepPartial<Source>): Source => h('source', props)
export const span = (props?: DeepPartial<Span>, children?: Children.Span): Span => h('span', props, children)
export const strong = (props?: DeepPartial<Strong>, children?: Children.Strong): Strong => h('strong', props, children)
export const style = (props?: DeepPartial<Style>, children?: Children.Style): Style => h('style', props, children)
export const sub = (props?: DeepPartial<Sub>, children?: Children.Sub): Sub => h('sub', props, children)
export const summary = (props?: DeepPartial<Summary>, children?: Children.Summary): Summary => h('summary', props, children)
export const sup = (props?: DeepPartial<Sup>, children?: Children.Sup): Sup => h('sup', props, children)
export const table = (props?: DeepPartial<Table>, children?: Children.Table): Table => h('table', props, children)
export const tbody = (props?: DeepPartial<Tbody>, children?: Children.Tbody): Tbody => h('tbody', props, children)
export const td = (props?: DeepPartial<Td>, children?: Children.Td): Td => h('td', props, children)
export const template = (props?: DeepPartial<Template>, children?: Children.Template): Template => h('template', props, children)
export const textarea = (props?: DeepPartial<Textarea>, children?: Children.Textarea): Textarea => h('textarea', props, children)
export const tfoot = (props?: DeepPartial<Tfoot>, children?: Children.Tfoot): Tfoot => h('tfoot', props, children)
export const th = (props?: DeepPartial<Th>, children?: Children.Th): Th => h('th', props, children)
export const thead = (props?: DeepPartial<Thead>, children?: Children.Thead): Thead => h('thead', props, children)
export const time = (props?: DeepPartial<Time>, children?: Children.Time): Time => h('time', props, children)
export const title = (props?: DeepPartial<Title>, children?: Children.Title): Title => h('title', props, children)
export const tr = (props?: DeepPartial<Tr>, children?: Children.Tr): Tr => h('tr', props, children)
export const track = (props?: DeepPartial<Track>): Track => h('track', props)
export const u = (props?: DeepPartial<U>, children?: Children.U): U => h('u', props, children)
export const ul = (props?: DeepPartial<Ul>, children?: Children.Ul): Ul => h('ul', props, children)
// Reserved word suffixed with "_".
export const var_ = (props?: DeepPartial<Var>, children?: Children.Var): Var => h('var', props, children)
export const video = (props?: DeepPartial<Video>, children?: Children.Video): Video => h('video', props, children)
export const wbr = (props?: DeepPartial<Wbr>): Wbr => h('wbr', props)