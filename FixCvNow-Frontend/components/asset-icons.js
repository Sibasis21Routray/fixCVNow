// components/asset-icons.js
// Custom PNG icon wrappers that match the Lucide icon interface (size, style, className).
// Use these as drop-in replacements for Lucide icons wherever a branded icon is needed.

const AssetIcon = ({ src, size = 24, style, className, alt = "" }) => (
  <img
    src={src}
    width={size}
    height={size}
    style={{ display: "inline-block", flexShrink: 0, ...style }}
    className={className}
    alt={alt}
  />
)

export const ResumeUploadIcon    = (props) => <AssetIcon src="/assets/resume-upload.png"          {...props} />
export const CloudUploadIcon     = (props) => <AssetIcon src="/assets/cloud-upload.png"           {...props} />
export const FileTransferIcon    = (props) => <AssetIcon src="/assets/file-transfer.png"          {...props} />
export const FolderUploadIcon    = (props) => <AssetIcon src="/assets/folder-upload-success.png"  {...props} />
export const AiBrainIcon         = (props) => <AssetIcon src="/assets/ai-brain.png"               {...props} />
export const ResumeOptimizeIcon  = (props) => <AssetIcon src="/assets/resume-optimize.png"        {...props} />
export const SmartEditIcon       = (props) => <AssetIcon src="/assets/smart-edit.png"             {...props} />
export const DocumentScanIcon    = (props) => <AssetIcon src="/assets/document-scan.png"          {...props} />
export const DocumentIcon        = (props) => <AssetIcon src="/assets/document-processing.png"    {...props} />
export const DocumentPreviewIcon = (props) => <AssetIcon src="/assets/document-preview.png"       {...props} />
export const DocumentSearchIcon  = (props) => <AssetIcon src="/assets/document-search.png"        {...props} />
export const AtsScanIcon         = (props) => <AssetIcon src="/assets/ats-scan.png"               {...props} />
export const SecureDownloadIcon  = (props) => <AssetIcon src="/assets/secure-download.png"        {...props} />
export const QuickTemplatesIcon  = (props) => <AssetIcon src="/assets/quick-templates.png"        {...props} />
export const ResumeExportIcon    = (props) => <AssetIcon src="/assets/resume-export.png"          {...props} />
