import { Link } from '@/components/Link';
import {
  ANDROID_RELEASES_URL,
  DISCORD_URL,
  GDG_NTUST_URL,
  GITHUB_ANDROID_REPO,
  GITHUB_IOS_REPO,
  GITHUB_ISSUES_URL,
  LICENSE_URL,
  SUPPORT_FORM_URL,
  TESTFLIGHT_URL,
} from '@/lib/constants';
import { useLocale } from '@/hooks/useLocale';
import { tFor } from '@/lib/messages';

export function Footer() {
  const { locale } = useLocale();
  const messages = tFor(locale).footer;

  return (
    <footer className="td-footer">
      <div className="td-container">
        <div className="td-footer-grid td-footer-grid--even">
          <div className="td-footer-col">
            <h4>{messages.download}</h4>
            <ul>
              <li>
                <a href={TESTFLIGHT_URL}>{messages.links.iosApp}</a>
              </li>
              <li>
                <a href={ANDROID_RELEASES_URL}>{messages.links.androidApp}</a>
              </li>
            </ul>
          </div>
          <div className="td-footer-col">
            <h4>{messages.openSource}</h4>
            <ul>
              <li>
                <a href={GITHUB_IOS_REPO}>{messages.links.iosRepo}</a>
              </li>
              <li>
                <a href={GITHUB_ANDROID_REPO}>{messages.links.androidRepo}</a>
              </li>
              <li>
                <a href={GITHUB_ISSUES_URL}>{messages.links.issues}</a>
              </li>
              <li>
                <a href={LICENSE_URL}>{messages.links.license}</a>
              </li>
            </ul>
          </div>
          <div className="td-footer-col">
            <h4>{messages.community}</h4>
            <ul>
              <li>
                <a href={DISCORD_URL}>{messages.links.discord}</a>
              </li>
              <li>
                <a href={GDG_NTUST_URL}>{messages.links.gdg}</a>
              </li>
              <li>
                <a href="/#tech">{messages.links.contributors}</a>
              </li>
            </ul>
          </div>
          <div className="td-footer-col">
            <h4>{messages.support}</h4>
            <ul>
              <li>
                <a href={SUPPORT_FORM_URL}>{messages.links.supportForm}</a>
              </li>
              <li>
                <Link to="/privacy-policy">{messages.links.privacy}</Link>
              </li>
              <li>
                <Link to="/delete-account">{messages.links.deleteAccount}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="td-footer-bottom">
          <span>{messages.copyright}</span>
          <span>{messages.org}</span>
        </div>
      </div>
    </footer>
  );
}
