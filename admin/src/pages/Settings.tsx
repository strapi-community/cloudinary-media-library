import { Typography, Grid, Box, Field, Flex } from '@strapi/design-system';
import { Form, Layouts, Page, useAuth, useNotification } from '@strapi/strapi/admin';
import { useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { getTranslation } from '../utils/getTranslation';
import { useAPI } from '../hooks/useAPI';
import { useSettingsAPI } from '../hooks/useSettingsApi';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ArrowClockwise, Check } from '@strapi/icons';
import { Button } from '@strapi/design-system';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import pluginPermissions from '../utils/permission';

const SettingsPage = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const api = useAPI();

  const readPermissions = useAuth('SettingsPage', (state) => state.permissions);
  const hasSettingsPermissions = useMemo(() => {
    return !!readPermissions.find(({ action }) => action === pluginPermissions.settings[0].action);
  }, [readPermissions]);
  const hasSettingsReadPermissions = useMemo(() => {
    return !!readPermissions.find(({ action }) => action === pluginPermissions.access[0].action);
  }, [readPermissions]);

  const { config, updateSettingsMutation, restoreSettingsMutation } = useSettingsAPI({
    restoreSettingsMutationSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.config.getKey(),
        exact: false,
      });
      toggleNotification({
        message: formatMessage({
          id: getTranslation('page.settings.action.restore.confirmation.success'),
        }),
        type: 'success',
      });
    },
    updateSettingsMutationSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.config.getKey(),
        exact: false,
      });
    },
  });

  const onTriggerSubmit = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  const onSubmit = useCallback(
    (values: any) => {
      updateSettingsMutation.mutate(values);
    },
    [updateSettingsMutation]
  );

  if (!hasSettingsReadPermissions) {
    return <Page.NoPermissions />;
  }

  if (config.isPending) {
    return <Page.Loading />;
  }

  if (config.status !== 'success') {
    // TODO
    return formatMessage({ id: getTranslation('page.settings.error') });
  }

  return (
    <>
      <Page.Title children={'Cloudinary - settings'} />
      <Page.Main>
        <Layouts.Header
          title={formatMessage({ id: getTranslation('page.settings.header.title') })}
          subtitle={formatMessage({ id: getTranslation('page.settings.header.description') })}
          as="h2"
          primaryAction={
            hasSettingsPermissions && (
              <Button type="submit" startIcon={<Check />} onClick={onTriggerSubmit}>
                {formatMessage({ id: getTranslation('page.settings.actions.submit') })}
              </Button>
            )
          }
        />
        <Layouts.Content>
          <Form
            method="POST"
            width="auto"
            height="auto"
            ref={formRef}
            onSubmit={onSubmit}
            initialValues={{
              cloud_name: config.data.cloud_name,
              api_key: config.data.api_key,
            }}
          >
            {({ values, onChange }) => (
              <Flex gap={4} direction="column">
                <Box background="neutral0" padding={6} shadow="filterShadow" width="100%" hasRadius>
                  <Typography variant="delta" as="h2">
                    {formatMessage({ id: getTranslation('page.settings.section.general') })}
                  </Typography>
                  <Grid.Root gap={4} marginTop={4} width="100%">
                    <Grid.Item xs={12}>
                      <Field.Root
                        width="100%"
                        hint={formatMessage({
                          id: getTranslation('page.settings.form.cloud-name'),
                        })}
                      >
                        <Field.Label htmlFor="cloud_name">
                          {formatMessage({ id: getTranslation('page.settings.form.cloud-name') })}
                        </Field.Label>
                        <Field.Input
                          value={values.cloud_name}
                          name="cloud_name"
                          onChange={onChange}
                          disabled={!hasSettingsPermissions}
                        />
                        <Field.Hint />
                      </Field.Root>
                    </Grid.Item>
                    <Grid.Item xs={12}>
                      <Field.Root
                        width="100%"
                        hint={formatMessage({ id: getTranslation('page.settings.form.api-key') })}
                      >
                        <Field.Label htmlFor="api_key">
                          {formatMessage({ id: getTranslation('page.settings.form.api-key') })}
                        </Field.Label>
                        <Field.Input
                          value={values.api_key}
                          name="api_key"
                          onChange={onChange}
                          disabled={!hasSettingsPermissions}
                        />
                        <Field.Hint />
                      </Field.Root>
                    </Grid.Item>
                  </Grid.Root>
                </Box>
                {hasSettingsPermissions && (
                  <Box
                    background="neutral0"
                    padding={6}
                    shadow="filterShadow"
                    width="100%"
                    hasRadius
                  >
                    <Flex gap={4} direction="column" alignItems="flex-start">
                      <Flex gap={2} direction="column" alignItems="flex-start">
                        <Typography variant="delta" as="h2">
                          {formatMessage({ id: getTranslation('page.settings.section.restore') })}
                        </Typography>
                        <Typography variant="pi" as="h4">
                          {formatMessage({ id: getTranslation('page.settings.section.subtitle') })}
                        </Typography>
                      </Flex>
                      <ConfirmationDialog
                        Trigger={({ onClick }) => (
                          <Button
                            variant="danger-light"
                            startIcon={<ArrowClockwise />}
                            onClick={onClick}
                          >
                            {formatMessage({
                              id: getTranslation('page.settings.action.restore.label'),
                            })}
                          </Button>
                        )}
                        onConfirm={restoreSettingsMutation.mutate}
                        title={formatMessage({
                          id: getTranslation('page.settings.action.restore.confirmation.header'),
                        })}
                        labelConfirm={formatMessage({
                          id: getTranslation('page.settings.action.restore.confirmation.confirm'),
                        })}
                        iconConfirm={<ArrowClockwise />}
                      >
                        {formatMessage({
                          id: getTranslation(
                            'page.settings.action.restore.confirmation.description'
                          ),
                        })}
                      </ConfirmationDialog>
                    </Flex>
                  </Box>
                )}
              </Flex>
            )}
          </Form>
        </Layouts.Content>
      </Page.Main>
    </>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default () => (
  <QueryClientProvider client={queryClient}>
    <SettingsPage />
  </QueryClientProvider>
);
