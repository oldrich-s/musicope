async function main() {

    document.body.style.overflow = 'hidden'
    document.body.style.backgroundColor = 'black'

    const [$, dom, { config }, { Game }] = await Promise.all([
        import('jquery'),
        import('../soil'),
        import("../config/config"),
        import("./game")
    ])

    const url = new URL(location.href)
    const file = url.searchParams.get('url')

    if (file) {
        const match = file.replace(/_/g, ' ').match(/^.*\/songs\/(.+)\/([^\/]+)\.mid$/)

        if (match) {
            document.body.appendChild(
                dom.div({ style: { position: 'absolute', color: 'white', className: 'title' } }, [
                    dom.div({}, [
                        dom.span({ style: { marginRight: '10px' } }, match[1]),
                        '/',
                        dom.span({ style: { color: 'yellow', marginLeft: '10px' } }, match[2])
                    ]),
                    dom.div({ className: 'canvasInfo', style: { fontSize: '20pt', marginTop: '10px' } }, [
                        dom.span({ className: 'canvasInfoDesc' }),
                        dom.span({ className: 'canvasInfoValue', style: { color: 'red' } })
                    ])
                ])
            )
            document.body.appendChild(dom.canvas({ className: 'canvas' }))

            config.c_songUrl = file
            const game = new Game()
        }
    } else {
        document.body.innerText = 'url missing'
    }

}

main()