import { GITHUB_TOKEN, GITHUB_USER } from '$env/static/private'

interface Day {
  date: string
  contributionCount: number
}
interface Response {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: { weeks: { contributionDays: Day[] }[] }
      }
    }
  }
}

const QUERY = `{
  user(login: "${GITHUB_USER}") {
    contributionsCollection {
      contributionCalendar {
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`

export const fetchFromGithub = async (): Promise<Record<string, number>> => {
  const res = await fetch('https://api.github.com/graphql', {
    body: JSON.stringify({ query: QUERY }),
    headers: { Authorization: `bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    method: 'POST'
  })
  if (!res.ok) {
    throw new Error(`GitHub GraphQL ${res.status}`)
  }

  const { weeks } = ((await res.json()) as Response).data.user.contributionsCollection
    .contributionCalendar
  return Object.fromEntries(
    weeks.flatMap((week) =>
      week.contributionDays.map((day) => [day.date, day.contributionCount] as const)
    )
  )
}
