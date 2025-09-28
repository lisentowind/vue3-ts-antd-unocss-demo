export const FilesRegExp
  = /^(application\/(vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|msword|pdf|vnd\.openxmlformats-officedocument\.presentationml\.presentation|vnd\.ms-powerpoint)|image\/(png|jpeg|bmp)|video\/mp4)$/i

export const ImageRegExp = /^(image\/(png|jpeg|bmp))$/i

export const WordRegExp
  = /^(application\/(vnd\.openxmlformats-officedocument\.wordprocessingml\.document|msword))$/i

export const ExcelRegExp
  = /^application\/(vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel)$/i

export const PdfRegExp = /^(application\/(pdf))$/i

export const PptRegExp
  = /^(application\/(vnd\.openxmlformats-officedocument\.presentationml\.presentation|ms-powerpoint))$/i

export const VideoRegExp
  = /^(video\/(mp4|mpeg|quicktime|x-msvideo|x-ms-wmv|x-flv))$/i

export const CompressRegExp
  = /^application\/(x-zip-compressed|zip|x-tar|x-rar|x-rar-compressed|x-7z-compressed|gzip|x-bzip2)$/i

export const UrlImageRegExp = /^(https?:\/\/.+?\.(?:png|jpg|jpeg|gif|bmp))$/i

export const UrlWordRegExp = /^(https?:\/\/.+?\.(?:doc|docx))$/i

export const UrlExcelRegExp = /^(https?:\/\/.+?\.(?:xls|xlsx))$/i

export const UrlPowerPointRegExp = /^(https?:\/\/.+?\.(?:ppt|pptx))$/i

export const UrlPdfRegExp = /^(https?:\/\/.+?\.pdf)$/i

export const UrlVideoRegExp
  = /^(https?:\/\/.+?\.(?:mp4|mpeg|quicktime|x-msvideo|x-ms-wmv|x-flv))$/i

export const UrlZipRegExp
  = /^(https?:\/\/.+?\.(?:zip|rar|7z|tar|gz|tgz|bz2|xz))(?:[?#].*)?$/i

export const AllRegExp = new RegExp(
  [
    FilesRegExp,
    ImageRegExp,
    WordRegExp,
    ExcelRegExp,
    PdfRegExp,
    PptRegExp,
    VideoRegExp,
    CompressRegExp,
    UrlImageRegExp,
    UrlWordRegExp,
    UrlExcelRegExp,
    UrlPowerPointRegExp,
    UrlPdfRegExp,
    UrlVideoRegExp,
    UrlZipRegExp,
  ]
    .map(r => r.source) // 取出正则的内容
    .join('|'), // 用 | 合并
  'i', // 忽略大小写
)
