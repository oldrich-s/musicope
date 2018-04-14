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
        const path = file.substring(0, file.lastIndexOf("/") + 1)
        const filename = file.substring(file.lastIndexOf("/") + 1, file.length)
        document.body.appendChild(
            dom.div({ style: { position: 'absolute', color: 'white', className: 'title' } }, [
                dom.div({}, [
                    dom.span({}, path),
                    dom.span({ style: { color: 'yellow' } }, filename)
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
    } else {
        document.body.innerText = 'url missing'
    }

}

main()