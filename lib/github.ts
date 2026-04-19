import type { Contributor as ContributorType } from "@/types/contributor";
import type { ProjectStats } from "@/types/stats";
import { statsFallback } from "@/data/stats-fallback";

const GITHUB_API = "https://api.github.com";

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
}

interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

const BOT_PATTERNS = [
  /\[bot\]$/i,
  /^dependabot/i,
  /^github-actions/i,
  /^renovate/i,
  /^claude/i,
];

function isBot(login: string): boolean {
  return BOT_PATTERNS.some((pattern) => pattern.test(login));
}

async function githubFetch<T>(url: string): Promise<T | null> {
  try {
    const headers = new Headers({
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "TigerDuck-Website/1.0",
    });

    if (process.env.GITHUB_TOKEN) {
      headers.set("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);
    }

    const res = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchRepoStats(
  owner: string,
  repo: string
): Promise<{ stars: number; latestVersion: string; latestReleaseDate: string }> {
  const [repoData, releaseData] = await Promise.all([
    githubFetch<GitHubRepo>(`${GITHUB_API}/repos/${owner}/${repo}`),
    githubFetch<GitHubRelease>(`${GITHUB_API}/repos/${owner}/${repo}/releases/latest`),
  ]);

  return {
    stars: repoData?.stargazers_count ?? 0,
    latestVersion: releaseData?.tag_name ?? statsFallback.latestVersion,
    latestReleaseDate: releaseData?.published_at ?? statsFallback.latestReleaseDate,
  };
}

export async function fetchContributors(
  owner: string,
  repo: string,
  platform: "ios" | "android"
): Promise<ContributorType[]> {
  const data = await githubFetch<GitHubContributor[]>(
    `${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=50`
  );

  if (!data) {
    return [];
  }

  return data
    .filter((contributor) => contributor.type === "User" && !isBot(contributor.login))
    .map((contributor) => ({
      login: contributor.login,
      avatar: contributor.avatar_url,
      html_url: contributor.html_url,
      contributions: contributor.contributions,
      platform,
    }));
}

export function mergeContributors(
  iosContributors: ContributorType[],
  androidContributors: ContributorType[]
): ContributorType[] {
  const merged = new Map<string, ContributorType>();

  for (const contributor of iosContributors) {
    merged.set(contributor.login, contributor);
  }

  for (const contributor of androidContributors) {
    const existing = merged.get(contributor.login);

    if (existing) {
      merged.set(contributor.login, {
        ...existing,
        contributions: existing.contributions + contributor.contributions,
      });
      continue;
    }

    merged.set(contributor.login, contributor);
  }

  return Array.from(merged.values()).sort((a, b) => b.contributions - a.contributions);
}

export async function fetchProjectStats(): Promise<ProjectStats> {
  try {
    const [iosStats, androidStats, iosContributors, androidContributors] = await Promise.all([
      fetchRepoStats("tigerduck-app", "tigerduck-app"),
      fetchRepoStats("tigerduck-app", "tigerduck-app-android"),
      fetchContributors("tigerduck-app", "tigerduck-app", "ios"),
      fetchContributors("tigerduck-app", "tigerduck-app-android", "android"),
    ]);

    return {
      iosStars: iosStats.stars || statsFallback.iosStars,
      androidStars: androidStats.stars || statsFallback.androidStars,
      iosContributors: iosContributors.length || statsFallback.iosContributors,
      androidContributors: androidContributors.length || statsFallback.androidContributors,
      latestVersion: androidStats.latestVersion || statsFallback.latestVersion,
      latestReleaseDate: androidStats.latestReleaseDate || statsFallback.latestReleaseDate,
    };
  } catch {
    return statsFallback;
  }
}

const github = {
  fetchRepoStats,
  fetchContributors,
  mergeContributors,
  fetchProjectStats,
};

export default github;
