export async function readBinaryFileAsString(url: string) {
    const data = await fetch(url).then(v => v.arrayBuffer())
    const str: string = String.fromCharCode.apply(null, new Uint8Array(data))
    return str
}

export async function readTextFile(url: string) {
    const text = await fetch(url).then(v => {
        if (v.ok) {
            return v.text()
        } else {
            throw v.text()
        }
    })
    return text
}

export async function writeTextFile(url: string, text: string) {
    return await fetch('/writetextfile?path=' + url, { method: 'post', body: text })
}

export async function listAllSongs() {
    return await fetch('/listsongs').then(v => v.json())
}