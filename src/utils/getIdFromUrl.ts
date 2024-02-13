export const getIdFromUrl = (url: string) => {
    const urlParts = url.split('/');
    const idIndex = urlParts.indexOf('users') + 1;
    return urlParts[idIndex];
};
