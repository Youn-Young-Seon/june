type Video = {
    idx: string;
    title: string;
    description: string;
    filename: string;
    fileUrl: string;
    thumbnail?: any;
    uploadDate: string;
    duration?: number;
    size?: number;
    views?: number;
    uploader?: string;
}

export default Video;