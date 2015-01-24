open System.IO

let root = DirectoryInfo __SOURCE_DIRECTORY__

let rec fn (dir: DirectoryInfo) =
  let strA =
    dir.GetFiles "*.mid"
      |> Array.map (fun file ->
        "\"../songs" + file.FullName.Replace(root.FullName, "").Replace("\\","/") + "\"" )
  let str2A = dir.GetDirectories() |> Array.collect (fun dir -> fn dir )
  Array.append strA str2A

let str = fn root

File.WriteAllText (root.FullName + "\\private.json", "[" + (str |> String.concat ",\n") + "]")