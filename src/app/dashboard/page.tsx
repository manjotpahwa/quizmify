import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopics from "@/components/dashboard/HotTopics";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
  title: "Dashboard | Quizmify",
};

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2"></div>
      <QuizMeCard></QuizMeCard>
      <HistoryCard></HistoryCard>
      <HotTopics></HotTopics>
      <RecentActivity></RecentActivity>
      <div className="grid mt-4 gap-4 md:grid-cols-2 lg:grid-cols-7"></div>
    </main>
  );
};

export default Dashboard;
