import PickForm from "@/components/PickModal"

export default function PicksPage() {
    return (
        <div className="p-6">
            <PickForm
                loggedUser={{ name: "hamshini", email: "hamshini@example.com" }}
            // onClose={() => window.history.back()}
            />
        </div>
    )
}