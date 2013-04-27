open System.IO

let copyFiles(sourcePath, destinationPath) =
  let files = Directory.GetFiles(sourcePath, "*.*", SearchOption.AllDirectories)
  for fromFile in files do
    if (fromFile.Contains @"\_assets\" ||
        fromFile.Contains "index." ||
        fromFile.Contains ".ico" ||
        fromFile.Contains @"\_lib\" ||
        fromFile.EndsWith @".php") &&
        fromFile.EndsWith ".js.map" = false &&
        fromFile.EndsWith ".ts" = false then
      let toFile = FileInfo (fromFile.Replace(sourcePath, destinationPath))
      if toFile.Exists then toFile.Delete()
      toFile.Directory.Create()
      File.Copy(fromFile, toFile.FullName)

let eraseFiles(path, searchPattern) =
  let files = Directory.GetFiles(path, searchPattern, SearchOption.AllDirectories)
  for file in files do File.Delete file

let eraseWebSiteJSMAP root =
  let websiteRoot = Path.Combine(root, "github", "src", "Musicope", "website")
  ["game"; "list"; "common"] |> List.iter(fun dir ->
    let path = Path.Combine(websiteRoot, dir)
    eraseFiles(path, "*.js")
    eraseFiles(path, "*.js.map") )

let copyAll root =
  let libPathIn = Path.Combine(root, "github", "src", "Musicope")
  let libPathOut = Path.Combine(root, "output")
  copyFiles(libPathIn, libPathOut)

[<EntryPoint>]
let main argv =
  let root = argv.[0]
  copyAll root
  eraseWebSiteJSMAP root
  0