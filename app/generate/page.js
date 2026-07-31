"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";

const Generate = () => {
  const searchParams = useSearchParams();

  // ✅ ALL HOOKS INSIDE COMPONENT
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [links, setLinks] = useState([{ link: "", linktext: "" }]);
  const [handle, setHandle] = useState(searchParams.get("handle") || "");
  const [pic, setPic] = useState("");
  const [desc, setDesc] = useState("");
  const [createdHandle, setCreatedHandle] = useState("");

  const [profiles, setProfiles] = useState([]);

  // ==============================
  // FETCH ALL PROFILES
  // ==============================
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const res = await fetch("/api/add");
    const data = await res.json();
    setProfiles(data);
  };

  // ==============================
  // FORM HELPERS
  // ==============================
  const handleChange = (index, field, value) => {
    setLinks((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addLink = () => {
    setLinks((prev) => [...prev, { link: "", linktext: "" }]);
  };

  // ==============================
  // CREATE / UPDATE
  // ==============================
  const submitLinks = async () => {
    const filteredLinks = links.filter(
      (l) => l.link.trim() !== "" && l.linktext.trim() !== ""
    );

    if (!handle || !pic || filteredLinks.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/add", {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          handle,
          pic,
          desc,
          links: filteredLinks,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);

        fetchProfiles();

        // RESET FORM
        setEditMode(false);
        setEditId(null);
        setLinks([{ link: "", linktext: "" }]);
        setHandle("");
        setPic("");
        setDesc("");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Server error");
    }
  };

  // ==============================
  // DELETE
  // ==============================
  const deleteProfile = async (handle) => {
    await fetch("/api/add", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle }),
    });

    fetchProfiles();
  };

  // ==============================
  // EDIT
  // ==============================
  const editProfile = (profile) => {
    setEditMode(true);
    setEditId(profile._id);
    setHandle(profile.handle);
    setLinks(profile.links);
    setPic(profile.pic);
    setDesc(profile.desc);
  };

  // ==============================
  // JSX
  // ==============================
  return (
    <>
      <ToastContainer />

      <div className="bg-[#E9C0E9] min-h-screen grid grid-cols-2">
        <div className="flex justify-center items-center flex-col text-gray-900">
          <div className="flex flex-col gap-5 mt-40">
            <h1 className="font-bold text-4xl">Create your BitTree</h1>

            {/* STEP 1 */}
            <div>
              <h2 className="font-semibold text-2xl">Step 1: Claim your Handle</h2>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="px-4 py-2 my-2 rounded-full focus:outline-pink-500"
                type="text"
                placeholder="Choose a handle"
              />
            </div>

            {/* STEP 2 */}
            <div>
              <h2 className="font-semibold text-2xl">Step 2: Add Links</h2>

              {links.map((item, index) => (
                <div key={index} className="flex gap-2 my-2">
                  <input
                    value={item.linktext}
                    onChange={(e) =>
                      handleChange(index, "linktext", e.target.value)
                    }
                    className="px-4 py-2 rounded-full"
                    placeholder="Link text"
                  />

                  <input
                    value={item.link}
                    onChange={(e) =>
                      handleChange(index, "link", e.target.value)
                    }
                    className="px-4 py-2 rounded-full"
                    placeholder="Link URL"
                  />
                </div>
              ))}

              <button
                onClick={addLink}
                className="mt-2 bg-slate-900 text-white px-5 py-2 rounded-3xl font-bold"
              >
                + Add Link
              </button>
            </div>

            {/* STEP 3 */}
            <div>
              <h2 className="font-semibold text-2xl">
                Step 3: Picture & Description
              </h2>

              <input
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                className="px-4 py-2 my-2 rounded-full"
                placeholder="Profile picture URL"
              />

              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="px-4 py-2 my-2 rounded-full"
                placeholder="Description"
              />

              <button
                onClick={submitLinks}
                className="bg-slate-900 text-white px-6 py-2 rounded-3xl font-bold mt-4"
              >
                {editMode ? "Update BitTree" : "Create your BitTree"}
              </button>
            </div>

            {/* LIST
            <h2 className="text-xl font-bold mt-10">Your BitTrees</h2>

            {profiles.map((p) => (
              <div key={p.handle} className="flex items-center gap-3 mt-3">
                <a
                  href={`/${p.handle}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-full"
                >
                  /{p.handle}
                </a>

                <button onClick={() => editProfile(p)}>✏️</button>
                <button onClick={() => deleteProfile(p.handle)}>🗑️</button>
              </div>
            ))} */}

            

            {/* BITTREE LIST */}
            <div className="passwords mt-10">
              <h2 className="font-bold text-2xl py-4">Your BitTrees</h2>

              {profiles.length === 0 && <div>No BitTrees to show</div>}

              {profiles.length !== 0 && (
                <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                  <thead className="bg-green-800 text-white">
                    <tr>
                      <th className="py-2">Handle</th>
                      <th className="py-2">Links</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="bg-green-100">
                    {profiles.map((p, index) => (
                      <tr key={p.handle || index}>
                        {/* HANDLE */}
                        <td className="py-2 border border-white text-center">
                          <a
                            href={`/${p.handle}`}
                            className="text-green-900 font-semibold hover:underline"
                          >
                            /{p.handle}
                          </a>
                        </td>

                        {/* LINKS COUNT */}
                        <td className="py-2 border border-white text-center">
                          {p.links?.length || 0}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-2 border border-white text-center">
                          <span
                            className="cursor-pointer mx-2"
                            onClick={() => editProfile(p)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/gwlusjdu.json"
                              trigger="hover"
                              style={{ width: "25px", height: "25px" }}
                            ></lord-icon>
                          </span>

                          <span
                            className="cursor-pointer mx-2"
                            onClick={() => deleteProfile(p.handle)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/skkahier.json"
                              trigger="hover"
                              style={{ width: "25px", height: "25px" }}
                            ></lord-icon>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>











          </div>
        </div>

        <div className="w-full h-screen bg-[#E9C0E9]">
          <img
            src="/generate.png"
            alt="Generate"
            className="h-full object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default Generate;
