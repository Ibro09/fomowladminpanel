"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import UsersTable from "../components/UsersTable";
import DiscordTable from "../components/DiscordTable";
import { withAuth } from "./withAuth";
import { Pencil, Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Users = {
  userId: string;
  username: string;
  subscription: "Free" | "Premium";
  botsCreated: number;
  dateCreated: string;
};

type User = {
  userId: number;
  premium: boolean;
  premiumUntil: string | null;
  _id: string;
  joinedAt: string;
  __v: number;
};
type DiscordUser = {
  userId: number;
  premium: boolean;
  premiumUntil: string | null;
  _id: string;
  joinedAt: string;
  __v: number;
};

type Bot = {
  _id: string;
  ownerId: number;
  username: string;
  token: string;
  description: string;
  __v: number;
  createdAt:string
};

const mockStats = {
  totalUsers: 1245,
  totalGroups: 87,
  activeSessions: 34,
  premiumUsers: 112,
  botsCreated: 19,
};
const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState(mockStats);
  const [bots, setBots] = useState<Bot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, botsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/bots"),
        ]);

        const [usersData, botsData]: [User[], Bot[]] = await Promise.all([
          usersRes.json(),
          botsRes.json(),
        ]);

        // Count bots per owner
        const botCountMap: Record<number, number> = botsData.reduce((acc, bot) => {
          acc[bot.ownerId] = (acc[bot.ownerId] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        // Merge bot counts into users
        const usersWithBotCount = usersData.map((user) => ({
          ...user,
          botsCreated: botCountMap[user.userId] || 0,
        }));

        setUsers(usersWithBotCount);
        setBots(botsData);
        console.log("Users:", usersWithBotCount);
        console.log("Bots:", botsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const [discordUsersRes, discordBotsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/bots"),
        ]);

        const [usersData, botsData]: [User[], Bot[]] = await Promise.all([
          discordUsersRes.json(),
          discordBotsRes.json(),
        ]);

        // Count bots per owner
        const botCountMap: Record<number, number> = botsData.reduce((acc, bot) => {
          acc[bot.ownerId] = (acc[bot.ownerId] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        // Merge bot counts into users
        const usersWithBotCount = usersData.map((user) => ({
          ...user,
          botsCreated: botCountMap[user.userId] || 0,
        }));

        setUsers(usersWithBotCount);
        setBots(botsData);
        console.log("discord Users:", usersWithBotCount);
        console.log("discord Bots:", botsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

//  Pagination
  
  
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Sidebar />
      <div className="flex min-h-screen bg-black text-white overflow-x-hidden ml-0 md:ml-[45px]">
        {/* Main content */}
        <div className="flex-1 px-5 md:px-10 overflow-x-hidden">
          <header className="py-6 mb-8">
            <h1 className="m-0 text-3xl text-white">📊 Dashboard Overview</h1>
          </header>

          {/* Stats cards */}
          <div className="flex flex-wrap gap-6 mb-8">
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="bg-[#171717] p-6 rounded-lg flex-1 min-w-[200px]"
              >
                <strong>{key.replace(/([A-Z])/g, " $1")}</strong>
                <div className="text-[35px] text-[#dd4870]">{value}</div>
              </div>
            ))}
          </div>

          <UsersTable usersList={users} />
          <DiscordTable />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
