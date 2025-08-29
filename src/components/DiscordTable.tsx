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
};

const sampleUsers: User[] = Array.from({ length: 45 }, (_, i) => ({
  userId: `U${i + 1}`,
  username: `user${i + 1}`,
  subscription: i % 2 === 0 ? "Free" : "Premium",
  botsCreated: i * 2,
  dateCreated: `2025-08-${(i % 30) + 1}`,
}));

export function UserTable() {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [editSubscription, setEditSubscription] = useState<"Free" | "Premium">(
    "Free"
  );

  // 🔍 Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Filter users with memoization
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // ✏️ Edit
  const handleEditSave = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.userId === editingUser.userId
          ? { ...u, subscription: editSubscription }
          : u
      )
    );
    setEditingUser(null);
  };

  // 🗑 Delete
  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.userId !== deletingUser.userId));
    setDeletingUser(null);
  };

  return (
    <>
      {/* 🔍 Title */}
      <div className="mt-[100px] mb-[20px] text-[22px]">
        <h1>Discord Users</h1>
      </div>

      {/* 🔍 Search */}
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

      {/* 📋 Table */}
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
                      className={`px-4 py-2 ${
                        u.subscription === "Premium"
                          ? "text-green-500"
                          : "text-pink-500"
                      }`}
                    >
                      {u.subscription}
                    </td>
                    <td className="px-4 py-2">{u.botsCreated}</td>
                    <td className="px-4 py-2">{u.dateCreated}</td>
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
                  <td
                    colSpan={6}
                    className="text-center text-gray-500 py-6"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* 📄 Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4 mb-[30px]">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ✏️ Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999]">
          <div className="bg-[#171717] rounded-lg shadow-lg p-6 max-w-lg w-[50%]">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Subscription</label>
              <select
                value={editSubscription}
                onChange={(e) =>
                  setEditSubscription(e.target.value as "Free" | "Premium")
                }
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

      {/* 🗑 Delete Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999]">
          <div className="bg-[#171717] rounded-lg shadow-lg p-6 max-w-lg w-[50%]">
            <h2 className="text-2xl font-bold mb-6 text-[#dd4870]">
              Delete User
            </h2>
            <p className="mb-6 text-gray-300">
              Are you sure you want to delete user{" "}
              <span className="font-bold">{deletingUser.username}</span>?
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
