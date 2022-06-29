import axios from '.';

export type GetThemeOptions = {
  pageSize: number;
  currentPage: number;
  keyword?: string;
  depLibrary?: string;
};

export type ThemeType = {
  author: string;
  cover: string;
  packageName: string;
  themeId: number | string;
  themeName: string;
  unpkgHost: string;
  version: string;
  _id: string;
};

export function getThemeList(params: GetThemeOptions) {
  return axios.get<ThemeType[]>(
    'https://arco.design/themes/api/open/themes/list',
    { params }
  );
}
