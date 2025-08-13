import { useState, useEffect } from "react";

export default function UrlLists({ refresh }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all URLs
  const fetchUrls = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/urls`);

      const data = await response.json();

      if (data.success) {
        setUrls(data.urls)
      }
    } catch (error) {
      console.error("Failed to fetch URLs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch URLs on component mount or when refresh changes
  useEffect(() => {
    fetchUrls();
  }, [refresh]);

  // Copy URL to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle URL deletion
  const handleDelete = async (id) => {
    if (!confirm("Delete this URL?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/urls/${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (data.success) {
        setUrls((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (e) {
      console.error(e);
      alert("Server error");
    } finally {
      setDeletingId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="card">
          <div className="animate-pulse text-center">Loading URLs...</div>
        </div>
      </div>
    );
  }

  // No URLs found
  if (urls?.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="card text-center">
          <p className="text-gray-500">No URLs shortened yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent URLs</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">Original URL</th>
                <th className="text-left py-3 px-2">Short URL</th>
                <th className="text-left py-3 px-2">Created</th>
                <th className="text-left py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls?.map((url) => (
                <tr
                  key={url._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-2">
                    <div className="max-w-xs">
                      <a
                        href={url.longUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block"
                        title={url.longUrl}
                      >
                        {url.longUrl}
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      {url.shortUrl}
                    </a>
                  </td>
                  <td className="py-3 px-2 text-gray-500">
                    {formatDate(url.createdAt)}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-3">
                      <button
                        onClick={() => copyToClipboard(url.shortUrl)}
                        className="text-purple-600 hover:text-purple-800 text-sm"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleDelete(url._id)}
                        disabled={deletingId === url._id}
                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                      >
                        {deletingId === url._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
