export default {
  name: "file-upload",
  title: "File upload",
  category: "Forms",
  description:
    "A dropzone and upload queue with thumbnails, progress, concurrency, cancel and retry, and inline validation.",
  dependencies: [],
  imports: "FileUpload, type FileUploadContext, type FileUploadItem",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const [files, setFiles] = useState<FileUploadItem[]>([])
  const upload = (file: File, { onProgress, signal }: FileUploadContext) =>
    new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open("POST", "/api/uploads")
      request.upload.onprogress = (event) => onProgress(event.loaded / event.total)
      request.onload = () =>
        request.status < 300
          ? resolve(JSON.parse(request.responseText))
          : reject(new Error(\`Server responded \${request.status}\`))
      request.onerror = () => reject(new Error("Network error"))
      signal.addEventListener("abort", () => request.abort())
      const body = new FormData()
      body.append("file", file)
      request.send(body)
    })
  return (
    <FileUpload
      files={files}
      onFilesChange={setFiles}
      upload={upload}
      accept="image/*,.pdf"
      maxSize={10 * 1024 * 1024}
      maxFiles={6}
    />
  )
}`,
  notes:
    "Pass `upload` and the component runs the queue: up to `concurrency` requests at once, each with an AbortSignal that fires on cancel, remove, or unmount, and progress reported as a fraction from 0 to 1. A rejected promise marks the file failed with the error's message and offers retry; whatever the promise resolves with is stored on the item as `response`. Leave `upload` out and it is a picker: files arrive as ready, and `name` mirrors them into a hidden file input so a native form post includes them. Files can be dropped, browsed with a click or Enter, or pasted while focus is inside; screenshots pasted as image.png get a timestamped name. `accept`, `maxSize`, `maxFiles`, duplicates, and your own `validate` reject files before they join the list, with the reasons shown inline and announced. While files are dragged anywhere on the page the dropzone lights up, and it warns before release when the types cannot be accepted. With `multiple={false}` a new pick replaces the current file. Image thumbnails use object URLs that are revoked when files leave; pass `previewUrl` to show a stored thumbnail instead. Once the list has files, the default dropzone shrinks to a single row so the queue stays in view.",
  previewWidth: 640,
  examples: [
    {
      name: "file-upload-demo",
      title: "Campaign assets",
      description:
        "Four files upload three at a time at different speeds. The product shot drops its connection at 38%; retry it from its row or from Retry failed. Drop or paste your own files to join the queue.",
    },
    {
      name: "file-upload-compact-demo",
      title: "Receipts in a form",
      description:
        "The compact variant inside an expense form, limited to two receipts. Submit waits for uploads to finish, and the dropzone says when the limit is reached.",
    },
  ],
  api: [
    [
      "files? / defaultFiles?",
      "FileUploadItem[]",
      "Controlled or initial files, { id; file?; name; size; type; status; progress; error?; previewUrl?; response? }.",
    ],
    [
      "onFilesChange?",
      "(files: FileUploadItem[]) => void",
      "Called when files are added or removed and as uploads progress.",
    ],
    [
      "upload?",
      "(file: File, { onProgress; signal; item }) => Promise<unknown>",
      "Uploads one file. Without it the component is a picker and files stay ready.",
    ],
    ["concurrency?", "number", "Uploads running at once. Defaults to 3."],
    ["accept?", "string", "Allowed types in the input's accept syntax, such as \"image/*,.pdf\"."],
    ["maxSize?", "number", "Largest file in bytes."],
    ["maxFiles?", "number", "Most files in the list. Extra files are rejected with a count message."],
    ["multiple?", "boolean", "Allow several files. When false, a new pick replaces the current file. Defaults to true."],
    ["variant?", '"default" | "compact"', "Dropzone and row density. Compact suits forms and side panels."],
    ["paste?", "boolean", "Accept files pasted while focus is inside the component. Defaults to true."],
    ["name?", "string", "Mirrors picked files into a hidden file input for native form posts."],
    [
      "validate?",
      "(file: File, files: FileUploadItem[]) => string | null | undefined | false",
      "Extra checks. Return a message to reject the file.",
    ],
    [
      "onReject?",
      "(rejections: FileRejection[]) => void",
      "Rejected files with { file; reason: \"type\" | \"size\" | \"count\" | \"duplicate\" | \"custom\"; message }.",
    ],
    [
      "onUploadComplete? / onUploadError?",
      "(item: FileUploadItem, result: unknown) => void",
      "Called when an upload resolves or fails. Canceled uploads call neither.",
    ],
    ["onRemove?", "(item: FileUploadItem) => void", "Called when a file is removed from its row or by Clear uploaded."],
    ["disabled?", "boolean", "Disables the dropzone, paste, and row actions."],
    ["hint?", "ReactNode", "Replaces the generated hint, which lists accepted types, size, and count limits."],
    ["showSummary?", "boolean", "Show the count and bulk actions above the list. Defaults to true in the default variant."],
    ["formatSize? / locale?", "(bytes: number) => string / string", "Size formatting. Defaults to binary units, so 10 MB means 10 × 1024²."],
    ["renderIcon?", "(item: FileUploadItem) => ReactNode", "Replaces the thumbnail or type icon of a row."],
    ["labels?", "Partial<FileUploadLabels>", "Interface copy for translation, including status names and rejection messages."],
    ["className?", "string", "Additional classes for the root."],
    ["formatBytes(bytes, locale?)", "(bytes: number, locale?: string) => string", "The size formatter, exported for your own summaries."],
  ],
} as const;
