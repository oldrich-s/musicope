import * as $ from 'jquery'
import * as dom from '../soil'
import * as App from './app'

const body = dom.div({ className: 'views' }, [
    dom.div({ className: 'view view-main' }, [
        dom.div({ className: 'pages' }, [
            dom.div({ className: 'page navbar-fixed', ['data-page']: "index" }, [
                dom.div({ className: 'navbar' }, [
                    dom.div({ className: 'navbar-inner' }, [
                        dom.div({ className: 'center sliding' }, 'Musicope'),
                    ])
                ]),
                dom.form({ className: 'searchbar' }, [
                    dom.div({ className: 'searchbar-input' }, [
                        dom.input({ type: 'search', className: 'mousetrap', autofocus: 'autofocus', placeholder: 'Search' }),
                        dom.a({ href: '#' })
                    ])
                ]),
                dom.div({ className: 'page-content', style: { paddingTop: '110px' } }, [
                    dom.div({ className: 'page-content list-scroll', style: { paddingTop: '0', textAlign: 'center' } }, [
                        dom.div({ className: 'content-block searchbar-not-found' }, 'Nothing found'),
                        dom.div({ className: 'list-block list-block-search media-list searchbar-found' }, [
                            dom.ul({ className: 'song-list' })
                        ])
                    ])
                ])
            ])
        ])
    ])
])

document.body.appendChild(body)

App.init()