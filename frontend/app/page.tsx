"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {

  const [matches, setMatches] = useState<any[]>([])
  const [picks, setPicks] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/upcoming`)
      .then(res => res.json())
      .then(setMatches)
  }, [])

  return (

    <div className="space-y-6">

      {/* Make Pick Card */}

      <div className="bg-white p-6 rounded-lg shadow">

        <div className="flex justify-between items-center">

          <h2 className="text-lg font-semibold">
            Make Your Pick
          </h2>

          <button
            onClick={() => router.push("/picks")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Pick Now
          </button>

        </div>

        <p className="text-gray-500 mt-2">
          Choose winners for today's matches
        </p>

      </div>


      {/* Today's Picks */}

      <div className="bg-white p-6 rounded-lg shadow">

        <h2 className="text-lg font-semibold mb-4">
          Your Picks Today
        </h2>

        {picks.length === 0 && (
          <p className="text-gray-500">
            No picks submitted yet
          </p>
        )}

        {picks.map((pick) => (

          <div
            key={pick.id}
            className="border rounded p-4 mb-3 flex justify-between"
          >

            <div>

              <p className="font-medium">
                {pick.teamA} vs {pick.teamB}
              </p>

              <p className="text-sm text-gray-500">
                Your Pick: {pick.choice}
              </p>

            </div>

            <span className="text-yellow-600 text-sm">
              Pending
            </span>

          </div>

        ))}

      </div>


      {/* Upcoming Matches */}

      <div className="bg-white p-6 rounded-lg shadow">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-semibold">
            Upcoming Matches
          </h2>

          <a
            href="/matches"
            className="text-blue-600 text-sm"
          >
            View All
          </a>

        </div>


        <div className="space-y-3">

          {matches.map((match) => (

            <div
              key={match.id}
              className="border rounded p-4 flex justify-between items-center"
            >

              <div>

                <p className="text-sm text-gray-500">
                  Match {match.matchNo}
                </p>

                <p className="font-medium">
                  {match.teamAShortName} vs {match.teamBShortName}
                </p>

              </div>

              <span className="text-sm text-gray-500">
                <p className="font-medium">
                  {match.venue}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(match.date).toLocaleDateString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </span>

            </div>

          ))}

        </div>

      </div>
    </div>

  )
}