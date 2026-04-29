export const SIDEBAR_WIDTH = 300;
export const COLLAPSED_WIDTH = 48;

/**
 * Parses projectId, folderId, and fileId from the current pathname.
 * Used to restore open/active state on page reload.
 */
export function parseActivePath(pathname) {
    const projectMatch = pathname.match(/\/project\/([^/]+)/);
    const folderMatch = pathname.match(/\/folder\/([^/]+)/);
    const fileMatch = pathname.match(/\/file\/([^/]+)/);

    return {
        projectId: projectMatch?.[1] ?? null,
        folderId: folderMatch?.[1] ?? null,
        fileId: fileMatch?.[1] ?? null,
    };
}

export function activeRenderedPath(pathname) {
    const projectMatch = pathname.match(/\/project\/([^/]+)/);
    const folderMatch = pathname.match(/\/folder\/([^/]+)/);
    const fileMatch = pathname.match(/\/file\/([^/]+)/);

    return {
        projectId: projectMatch?.[1] ?? null,
        folderId: folderMatch?.[1] ?? null,
        fileId: fileMatch?.[1] ?? null,
        activeType: fileMatch ? "file" : folderMatch ? "folder" : projectMatch ? "project" : null,
    };
}

// Fix #1: buildPath moved here from FileNode.js where it didn't belong
export function buildPath(data, type) {
    const sorted = [...data].sort((a, b) => a.level - b.level);
    const indexOfType = sorted.findIndex((item) => item.type === type);
    const trimmed = sorted.slice(0, indexOfType + 1);

    const project = trimmed.find((i) => i.type === "project");
    const folder = trimmed.find((i) => i.type === "folder");
    const file = trimmed.find((i) => i.type === "file");

    if (type === "project") return `/project/${project?.id}`;
    if (type === "folder") return `/project/${project?.id}/folder/${folder?.id}`;
    if (type === "file") return `/project/${project?.id}/folder/${folder?.id}/file/${file?.id}`;
}