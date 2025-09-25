export const fileTypeMap = new Map([
  ['png', 'image'],
  ['jpg', 'image'],
  ['jpeg', 'image'],
  ['gif', 'image'],
  ['mp4', 'video'],
  ['mp3', 'audio'],
  ['pdf', 'pdf2'],
  ['doc', 'word'],
  ['docx', 'word'],
  ['xls', 'excel'],
  ['xlsx', 'excel'],
  ['ppt', 'powerpoint'],
  ['pptx', 'powerpoint'],
  ['txt', 'txt'],
  ['zip', 'zip'],
  ['rar', 'zip'],
  ['7z', 'zip'],
])
export type FileActionEvent
  = | 'view'
    | 'download'
    | 'continue'
    | 'pause'
    | 'cancel'
    | 'reTry'
    | 'delete'
