<template>
  <a-modal v-bind="attrs" :width="900" mask :footer="!!currentTheme">
    <template #title>
      <a-row class="w-full pr-[30px]" justify="space-between" align="center">
        <a-typography-text>{{
          $t('settings.navbar.theme.install')
        }}</a-typography-text>
        <a-input-search
          v-model="query.keyword"
          class="important-w-[300px]"
          :loading="query.loading"
          :readonly="query.loading"
          allow-clear
          :placeholder="$t('settings.navbar.theme.search')"
          @search="handleSearch"
          @keydown.enter="handleSearch"
        />
      </a-row>
    </template>
    <template #footer>
      <a-row class="w-full" justify="space-between" align="center">
        <a-typography-text>
          当前主题: {{ currentTheme.themeName }}
        </a-typography-text>
        <a-button type="primary" status="success" @click="resetTheme">
          <template #icon> <icon-close /> </template>重置主题
        </a-button>
      </a-row>
    </template>
    <a-empty v-if="query.list.length === 0" class="my-[200px]" />
    <a-row :gutter="20">
      <a-col
        v-for="(item, idx) in query.list"
        :key="idx"
        :span="8"
        class="p-[10px]"
      >
        <a-card hoverable>
          <template #cover>
            <a-skeleton v-if="query.loading" class="block" animation>
              <a-skeleton-shape class="important-w-full important-h-[160px]" />
            </a-skeleton>
            <img
              v-else
              :src="item.cover"
              :alt="item.themeName"
              class="w-full h-[160px]"
            />
          </template>
          <template #actions>
            <a-skeleton
              v-if="query.loading"
              class="important-w-[220px]"
              animation
            >
              <a-skeleton-shape
                class="important-h-[30px] important-w-[120px] important-inline-block"
              />
              <a-skeleton-shape
                class="important-ml-[20px] important-h-[30px] important-w-[80px] important-inline-block"
              />
            </a-skeleton>
            <template v-else>
              <a-link
                icon
                :href="`https://arco.design/themes/design/${item.themeId}`"
                target="__blank"
              >
                在主题商店打开
              </a-link>
              <a-button type="primary" size="mini" @click="installTheme(item)">
                安装主题
              </a-button>
            </template>
          </template>
          <a-skeleton v-if="query.loading" class="important-block" animation>
            <a-skeleton-shape
              class="important-h-[20px] important-w-full important-mb-[20px]"
            />
          </a-skeleton>
          <a-card-meta :title="query.loading ? '' : item.themeName">
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
    <a-pagination
      v-show="!query.loading && query.total"
      v-model:current="query.current"
      class="justify-end"
      :total="query.total"
      show-total
    />
  </a-modal>
</template>

<script lang="ts" setup>
  import { reactive, watch, useAttrs } from 'vue';
  import { StorageSerializers, useStorage } from '@vueuse/core';
  import { getThemeList, ThemeType } from '@/api/theme';
  import { Notification, Message } from '@arco-design/web-vue';

  const attrs = useAttrs();
  const query = reactive({
    current: 1,
    total: 0,
    keyword: '',
    list: Array.from({ length: 6 }).fill({}),
    loading: true,
  });

  const getData = ({ page, keyword }: { page: number; keyword: string }) => {
    query.loading = true;
    query.loading = Array.from({ length: 6 }).fill({});
    getThemeList({
      pageSize: 6,
      currentPage: page,
      keyword,
      depLibrary: '@arco-design/web-vue',
    })
      .then((res) => {
        query.list = res.list;
        query.total = res.total;
      })
      .finally(() => {
        query.loading = false;
      });
  };

  const handleSearch = () => {
    getData({ page: 1, keyword: query.keyword });
    query.current = 1;
  };

  const currentTheme = useStorage('online-theme', null, localStorage, {
    serializer: StorageSerializers.object,
  });

  const installTheme = (theme: ThemeType, init = false) => {
    if (!init) {
      Notification.info({
        id: 'menuNotice', // Keep the instance id the same
        content: 'loading',
        closable: true,
      });
    }
    const link = document.createElement('link');
    const src = `${theme.unpkgHost}${theme.packageName}@${theme.version}/css/arco.css`;
    link.id = 'arco-online-theme';
    link.href = src;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.onload = () => {
      if (init) {
        Message.success(`当前主题：${theme.themeName}`);
        return;
      }
      Notification.success({
        id: 'menuNotice',
        content: 'success',
        closable: true,
      });
      currentTheme.value = theme;
    };
    link.onerror = () => {
      if (init) {
        Message.error('初始化主题失败');
        return;
      }
      Notification.error({
        id: 'menuNotice',
        content: 'error',
        closable: true,
      });
    };
    document.body.appendChild(link);
  };

  if (currentTheme.value) {
    installTheme(currentTheme.value, true);
  }

  const resetTheme = () => {
    const link = document.getElementById('arco-online-theme');
    if (link) {
      const parent = link.parentElement;
      if (parent) {
        parent.removeChild(link);
      }
    }
    currentTheme.value = null;
  };

  watch(
    [() => attrs.visible, () => query.current],
    () => {
      if (attrs.visible) {
        getData({ page: query.current, keyword: query.keyword });
      }
    },
    {
      immediate: true,
    }
  );
</script>

<style lang="less" scoped></style>
