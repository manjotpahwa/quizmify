import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import HistoryComponent from "../HistoryComponent";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

type Props = {};

const RecentActivity = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <Card className="col-span-4 ls:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold"> Recent Activities</CardTitle>
        <CardDescription>You have played total of 7 games.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        Histories
        <HistoryComponent
          limit={10}
          userId={session.user.id}
        ></HistoryComponent>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
