"use client"
import MySelect from "@/components/styles/Myselect"
import { getUpcomingMatches, getAllMatchPicks, getSeasonPrediction, getTeams, getPlayersByTeams, getLeaderboard } from "@/lib/api"
import { customSelectStyles } from "@/lib/reactSelectStyles"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {

  const [matches, setMatches] = useState<any[]>([])
  const [picks, setPicks] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const [seasonPicks, setSeasonPicks] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [playersByMatch, setPlayersByMatch] = useState<Record<string, any[]>>({})
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  useEffect(() => {
    getUpcomingMatches().then(setMatches)
    getAllMatchPicks().then(setPicks)
    getSeasonPrediction().then(setSeasonPicks)
    getTeams().then(setTeams);
    getLeaderboard().then(setLeaderboard)

  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])
  useEffect(() => {
    matches.forEach(async (match) => {
      if (playersByMatch[match.id]) return

      const players = await getPlayersByTeams([
        match.teamAShortName,
        match.teamBShortName,
      ])

      setPlayersByMatch((prev) => ({
        ...prev,
        [match.id]: players,
      }))
    })
  }, [matches])
  if (!user) {
    return <p className="p-6">Please login first</p>
  }
  const userSeasonPick = seasonPicks.find(
    pick => pick.userId === user.id
  )

  const teamMap = Object.fromEntries(
    teams.map(team => [team.id, team.shortName])
  );
  const isAdmin = user.role === "ADMIN"

  return (

    <div className="space-y-6">

      {/* Today's Picks */}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-black font-semibold mb-4">
            Your Picks Today
          </h2>
          <button
            onClick={() => router.push("/picks")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Pick Now
          </button>

        </div>
        <button
          onClick={() => router.push("/leaderboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View
          scoreboard
        </button>
        {/* {picks.length === 0 && (
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
                Your Pick:{pick.userId} -  {pick.teamPickedId}
              </p>

            </div>

            <span className="text-yellow-600 text-sm">
              Pending
            </span>

          </div>

        ))} */}

      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-black font-semibold mb-4">
            Top 4, Bottom 2, Orange and Purple cap
          </h2>

          {/* <button
            onClick={() => router.push("/seasonPick")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Pick Now
          </button> */}

        </div>
        <br></br>
        <div className="flex justify-between items-center">
          {!userSeasonPick ? (
            <p className="text-gray-500">No picks submitted yet</p>
          ) : (
            <div>
              <p>
                <strong>Top 4:</strong>{" "}
                {teamMap[userSeasonPick.top1TeamId]}, {teamMap[userSeasonPick.top2TeamId]},{" "}
                {teamMap[userSeasonPick.top3TeamId]}, {teamMap[userSeasonPick.top4TeamId]}
              </p>

              <p>
                <strong>Bottom 2:</strong>{" "}
                {teamMap[userSeasonPick.bottom1TeamId]}, {teamMap[userSeasonPick.bottom2TeamId]}
              </p>

              <p>
                <strong>Orange Cap:</strong>{" "}
                {userSeasonPick.orangeCap1}, {userSeasonPick.orangeCap2},{" "}
                {userSeasonPick.orangeCap3}
              </p>

              <p>
                <strong>Purple Cap:</strong>{" "}
                {userSeasonPick.purpleCap1}, {userSeasonPick.purpleCap2},{" "}
                {userSeasonPick.purpleCap3}
              </p>
            </div>
          )}

          <a
            href="/seasonPrediction"
            className="text-blue-600 text-sm"
          >
            View All
          </a>
        </div>

      </div>

      {/* Upcoming Matches */}

      <div className="bg-white p-6 rounded-lg shadow">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg text-black font-semibold">
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

          {matches.map((match) => {

            const canViewPicks =
              match.status === "STARTED" && match.actualStart;

            return (
              <div
                key={match.id}
                className="border rounded p-4 flex justify-between items-center"
              >

                {/* LEFT */}
                <div>
                  <p className="text-sm text-gray-500">
                    Match {match.matchNo}
                  </p>

                  <p className="font-medium text-black">
                    {match.teamAShortName} vs {match.teamBShortName}
                  </p>

                  {/* ✅ STATUS */}
                  <p className={`text-sm mt-1
          ${match.status === "STARTED" ? "text-green-600" :
                      match.status === "DELAYED" ? "text-yellow-600" :
                        "text-gray-500"}`}>
                    {match.status}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right">

                  <p className="font-medium text-black">{match.venue}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(match.date).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>


                  <div className="flex gap-2 mt-2 justify-end">

                    {/* START */}
                    {isAdmin && match.status === "SCHEDULED" && (
                      <button
                        onClick={async () => {
                          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/match/start`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ matchId: match.id })
                          });
                          window.location.reload();
                        }}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Start
                      </button>
                    )}

                    {/* DELAY */}
                    {/* {(match.status === "SCHEDULED" || match.status === "DELAYED") && (
                        <button
                          onClick={async () => {
                            const time = prompt("Enter new start time (YYYY-MM-DD HH:mm)");
                            if (!time) return alert("Time required");

                            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/match/delay`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                matchId: match.id,
                                actualStart: time
                              })
                            });

                            window.location.reload();
                          }}
                          className="bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Delay
                        </button>
                      )} */}

                    {/* COMPLETE */}
                    {match.status === "STARTED" && (
                      <button
                        onClick={() => {
                          setSelectedMatch(match)
                          setShowCompleteModal(true)
                        }}
                        className="bg-purple-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Complete
                      </button>
                    )}
                    {/* CANCEL */}
                    {isAdmin && match.status !== "COMPLETED" && match.status !== "CANCELLED" && (
                      <button
                        onClick={async () => {
                          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/match/cancel`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ matchId: match.id })
                          });
                          window.location.reload();
                        }}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Cancel
                      </button>
                    )}

                    {/* VIEW PICKS */}
                    {match.status === "STARTED" && match.actualStart && isAdmin && (
                      <button
                        onClick={() => router.push(`/admin/match/${match.id}/picks`)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      >
                        View Picks
                      </button>
                    )}
                  </div>


                  {/* ✅ PLAYER VIEW PICKS (optional) */}
                  {canViewPicks && (
                    <button
                      onClick={() => router.push(`/match/${match.id}/picks`)}
                      className="text-blue-600 text-xs mt-2"
                    >
                      View Approved Picks
                    </button>
                  )}

                </div>
              </div>
            );
          })}

        </div>

      </div>

      {showCompleteModal && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 space-y-4">

            <h2 className="text-lg font-semibold">
              Complete Match {selectedMatch.matchNo}
            </h2>

            {/* Winning Team */}
            <select
              onChange={(e: any) =>
                setSelectedMatch((prev: any) => ({
                  ...prev,
                  winningTeamId: e.target.value,
                }))
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Select Winning Team</option>
              <option value={selectedMatch.teamAShortName}>
                {selectedMatch.teamAShortName}
              </option>
              <option value={selectedMatch.teamBShortName}>
                {selectedMatch.teamBShortName}
              </option>
            </select>

            {/* MoM */}
            <select
              onChange={(e: any) =>
                setSelectedMatch((prev: any) => ({
                  ...prev,
                  manOfMatch: e.target.value,
                }))
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Select Man of the Match</option>
              {(playersByMatch[selectedMatch.id] || []).map((p: any) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!selectedMatch.winningTeamId || !selectedMatch.manOfMatch) {
                    return alert("All fields required")
                  }

                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match/complete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      matchId: selectedMatch.id,
                      winningTeamId: selectedMatch.winningTeamId,
                      manOfMatch: selectedMatch.manOfMatch,
                    }),
                  })

                  setShowCompleteModal(false)
                  window.location.reload()
                }}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div >

  )
}