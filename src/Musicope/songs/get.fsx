open System.IO

let root = DirectoryInfo __SOURCE_DIRECTORY__

let rec fn (dir: DirectoryInfo) =
  let str =
    dir.GetFiles "*.mid"
      |> Array.map (fun file ->
        "\"../songs" + file.FullName.Replace(root.FullName, "").Replace("\\","/") + "\"" )
      |> String.concat ",\n"
  let str2 = dir.GetDirectories() |> Array.map (fun dir -> fn dir ) |> String.concat ",\n"
  let mid = if str.Length > 10 && str2.Length > 10 then ",\n" else ""
  str + mid + str2

let str = fn root

File.WriteAllText (root.FullName + "\\songs.json", "[" + str + "]")