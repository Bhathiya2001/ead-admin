"use client";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Order {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: "Delivered" | "Ongoing" | "Cancelled";
  lastUpdated: string;
}

const orders: Order[] = [
  {
    id: "1",
    name: "Nike Air Max",
    category: "Shoes",
    price: 199.99,
    quantity: 45,
    status: "Delivered",
    lastUpdated: "2024-03-15",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    category: "Electronics",
    price: 999.99,
    quantity: 5,
    status: "Ongoing",
    lastUpdated: "2024-03-14",
  },
  {
    id: "3",
    name: "MacBook Pro",
    category: "Electronics",
    price: 1299.99,
    quantity: 0,
    status: "Cancelled",
    lastUpdated: "2024-03-13",
  },
  {
    id: "4",
    name: "Children's shoes",
    category: "Children items",
    price: 199.99,
    quantity: 5,
    status: "Delivered",
    lastUpdated: "2024-03-15",
  },
];

export default function OrderPage() {
  const [sortBy, setSortBy] = useState<keyof Order>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "All">(
    "All"
  );
  const [filterDate, setFilterDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order["status"]>("Delivered");

  const sortOrders = (a: Order, b: Order) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch = order.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesDate =
        !filterDate || order.lastUpdated === filterDate; // Exact date match

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort(sortOrders);

  const handleSort = (column: keyof Order) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const openDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
    setNewStatus(order.status);
  };

  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setIsStatusModalOpen(false);
  };

  const changeStatus = () => {
    if (selectedOrder) {
      selectedOrder.status = newStatus;
      closeModal();
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "Ongoing":
        return "text-yellow-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search Orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-96"
        />
        <div className="w-5" />
        <label className="text-gray-600">Filter by date:</label>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-35"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {statusFilter === "All" ? "Status" : statusFilter}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Delivered")}>
              Delivered
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Ongoing")}>
              Ongoing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Cancelled")}>
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead onClick={() => handleSort("price")} className="cursor-pointer">
                <div className="flex items-center">
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.category}</TableCell>
                <TableCell>${order.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={getStatusColor(order.status)}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.lastUpdated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openDetailsModal(order)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openStatusModal(order)}
                        className="text-green-600"
                      >
                        Change Status
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p><strong>Name:</strong> {selectedOrder.name}</p>
            <p><strong>Category:</strong> {selectedOrder.category}</p>
            <p><strong>Price:</strong> ${selectedOrder.price.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
            <p><strong>Last Updated:</strong> {selectedOrder.lastUpdated}</p>
            <Button onClick={closeModal} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Change Order Status</h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-red-700 focus:outline-none ml-3"
            >
              ✕
            </button>
          </div>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as Order["status"])}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none hover:bg-gray-100"
          >
            <option value="Delivered">Delivered</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={closeModal}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
            >
              Cancel
            </button>
            <button
              onClick={changeStatus}
              className="py-2 px-4 bg-black hover:bg-gray-600 text-white rounded-md transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
}
