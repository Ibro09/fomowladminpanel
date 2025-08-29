"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Search, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type User = {
  userId: string;
  username: string;
  subscription: "Free" | "Premium";
  botsCreated: number;
  dateCreated: string;
  premium?: boolean;
  joinedAt?: string;
};

export function UserTable({ usersList }: { usersList: User[] }) {
  const [users, setUsers] = useState<User[]>(usersList);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [editSubscription, setEditSubscription] = useState<"Free" | "Premium">("Free");
const [editPremium, setEditPremium] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

const filteredUsers = useMemo(() => {
  return (users || []).filter((u) =>
    (u.userId?.toString().toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (u.username?.toString().toLowerCase() || "").includes(searchQuery.toLowerCase())
  );
}, [users, searchQuery]);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  useEffect(() => {
    setUsers(usersList);
  }, [usersList]);

const handleEditSave = async () => {
  if (!editingUser) return;
  
  const updatedUser = { ...editingUser, premium: editSubscription ==='Premium' ? true : false };
console.log();

  try {
    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) =>
        u.userId === editingUser.userId ? updatedUser : u
      )
    );
    setEditingUser(null);

    // Call Next.js API route
    const response = await fetch(`/api/users/${editingUser.userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ premium: editSubscription ==='Premium' ? true : false }),
    });
    
    if (!response.ok) throw new Error("Failed to update user");

    console.log("User updated in DB");

  } catch (error) {
    console.error(error);
    // Optionally revert state
  }
};

const handleDeleteConfirm = async () => {
  if (!deletingUser) return;

  try {
    // Remove from state first
    setUsers((prev) => prev.filter((u) => u.userId !== deletingUser.userId));
    setDeletingUser(null);

    // Call API route
    const response = await fetch(`/api/users/${deletingUser.userId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete user");

    console.log("User deleted from DB");

  } catch (error) {
    console.error(error);
    // Optionally revert state
  }
};


  return (
    <>
      <div className="mt-[100px] mb-[20px] text-[22px]">
        <h1>Telegram Users</h1>
      </div>

      <div className="flex gap-2 items-center mb-4 w-full">
        <Input
          placeholder="Search by UserID or Username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#171717] border-none text-white focus:outline-none py-5"
        />
        <Button className="bg-[#dd4870] hover:bg-[#dd4870]/70">
          <Search className="w-4 h-4 mr-2" /> Search
        </Button>
      </div>

      <ScrollArea className="w-full max-w-full" type="auto">
        <div className="min-w-[700px]">
          <table className="w-full text-white border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="px-4 py-2">UserID</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Subscription</th>
                <th className="px-4 py-2">No. of Bots Created</th>
                <th className="px-4 py-2">Date Created</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((u) => (
                  <tr key={u.userId} className="odd:bg-[#171717]">
                    <td className="px-4 py-2">{u.userId}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td
                      className={`px-4 py-2 ${u.premium ? "text-green-500" : "text-pink-500"}`}
                    >
                      {u.premium ? "Premium" : "Free"}
                    </td>
                    <td className="px-4 py-2">{u.botsCreated}</td>
                    <td className="px-4 py-2">{u.dateCreated || u.joinedAt?.slice(0, 10)}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setEditSubscription(u.subscription);
                        }}
                        className="bg-pink-900 p-2 rounded"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingUser(u)}
                        className="bg-pink-900 p-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-6">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex justify-center items-center gap-2 mt-4 mb-[30px]">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999]">
          <div className="bg-[#171717] rounded-lg shadow-lg p-6 max-w-lg w-[50%]">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Subscription</label>
              <select
                value={editSubscription}
                onChange={(e) => setEditSubscription(e.target.value as "Free" | "Premium")}
                className="rounded px-3 py-2 w-full bg-black"
              >
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-black rounded border border-white/20"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#dd4870] rounded"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999]">
          <div className="bg-[#171717] rounded-lg shadow-lg p-6 max-w-lg w-[50%]">
            <h2 className="text-2xl font-bold mb-6 text-[#dd4870]">Delete User</h2>
            <p className="mb-6 text-gray-300">
              Are you sure you want to delete user <span className="font-bold">{deletingUser.username}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-black rounded border border-white/20"
                onClick={() => setDeletingUser(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#dd4870] rounded"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserTable;
