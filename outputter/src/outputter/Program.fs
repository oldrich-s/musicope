open System.IO

let createAllDirs(sourcePath, destinationPath) =
  let dirs = Directory.GetDirectories(sourcePath, "*", SearchOption.AllDirectories)
  for dir in dirs do
    Directory.CreateDirectory(dir.Replace(sourcePath, destinationPath)) |> ignore

let copyFiles(sourcePath, destinationPath) =
  let files = Directory.GetFiles(sourcePath, "*.*", SearchOption.AllDirectories)
  for fromFile in files do
    let toFile = fromFile.Replace(sourcePath, destinationPath)
    if File.Exists toFile then File.Delete toFile
    File.Copy(fromFile, toFile)

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
  createAllDirs(libPathIn, libPathOut)
  copyFiles(libPathIn, libPathOut)

[<EntryPoint>]
let main argv =
  let root = argv.[0]
  copyAll root
  eraseWebSiteJSMAP root
  0