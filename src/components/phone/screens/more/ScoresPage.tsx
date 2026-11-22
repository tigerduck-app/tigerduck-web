import { usePhoneLocale } from '../../lib/i18n';
import { Page } from '../../ui/Page';
import { EmptyState } from '../../ui/controls';
import { useRefresh } from '../useRefresh';

/** The demo data has no school scores yet, so the page shows the app's empty state. */
export function ScoresPage() {
  const { t } = usePhoneLocale();
  const { refresh } = useRefresh();
  return (
    <Page title={t('feature_score')} onRefresh={refresh}>
      <EmptyState icon="chartLine" title={t('score_empty_title')} />
      <p className="td-ph-group-footer" style={{ textAlign: 'center', marginTop: -36 }}>
        {t('score_empty_message')}
      </p>
    </Page>
  );
}
