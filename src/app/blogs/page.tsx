"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, Calendar } from "lucide-react";
import Link from "next/link";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "";

interface Blog {
  _id: string;
  slug: string;
  heading: string;
  subHeading?: string;
  cardImage?: string;
  category?: string;
  featured?: boolean;
  publishedAt?: string;
  author?: {
    name?: string;
    avatar?: string;
  } | string;
}

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${CMS_URL}/api/v1/connector/posts`, {
          headers: {
            "x-site-token": SITE_TOKEN,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.heading?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter && blog.publishedAt) {
      const blogDate = new Date(blog.publishedAt).toISOString().split('T')[0];
      matchesDate = blogDate === dateFilter;
    } else if (dateFilter && !blog.publishedAt) {
        matchesDate = false;
    }

    return matchesSearch && matchesDate;
  });

  const allFeaturedBlogs = blogs.filter((b) => b.featured);
  const filteredFeaturedBlogs = filteredBlogs.filter((b) => b.featured);
  const featuredBlogs =
    filteredFeaturedBlogs.length > 0
      ? filteredFeaturedBlogs
      : allFeaturedBlogs.length > 0
      ? [allFeaturedBlogs[0]]
      : [];

  const regularBlogs = filteredBlogs;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  const getAuthorName = (author: any) => {
    if (typeof author === 'string') return author;
    return author?.name || "Masterstroke Editorial";
  };

  const renderBlogCard = (blog: Blog, isFeatured: boolean) => (
    <Link 
      href={`/blogs/${blog.slug}`} 
      key={blog._id || blog.slug}
      className={`flex flex-col h-full bg-white border border-black hover:border-[#e31e24] transition-all duration-200 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 rounded-lg overflow-hidden w-full`}
    >
      <div className="w-full bg-[#f9fafb] relative">
        {blog.cardImage ? (
          <img 
            src={blog.cardImage} 
            alt={blog.heading} 
            className="w-full aspect-video object-contain"
          />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" /> Featured
          </div>
        )}
      </div>
      
      <div className="flex flex-col p-[12px_14px] flex-grow gap-[6px]">
        {blog.category && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#2563eb]">
            {blog.category}
          </span>
        )}
        
        <h3 className="m-0 text-[15px] font-semibold leading-[1.35] text-[#111827]">
          {blog.heading}
        </h3>
        
        {blog.subHeading && (
          <p className="m-0 text-[13px] leading-[1.4] text-[#4b5563]">
            {blog.subHeading}
          </p>
        )}
        
        <div className="text-[12px] text-[#9ca3af] mt-auto pt-1">
          {[getAuthorName(blog.author), formatDate(blog.publishedAt)].filter(Boolean).join(" · ")}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] selection:bg-[var(--mst-red)] selection:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[var(--bg-muted)] to-[var(--bg)] pt-12 pb-8 border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.05]"></div>
        
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--mst-red)]/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-purple)]/10 rounded-full blur-3xl translate-y-1/2"></div>

        <div className="mx-auto max-w-6xl px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Hero Text - Left Side */}
            <div className="flex-1 text-left w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(227,30,36,0.1)] text-[var(--mst-red)] text-sm font-bold mb-6 border border-[rgba(227,30,36,0.2)] backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Masterstroke Updates</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text)] mb-4 tracking-tight leading-tight whitespace-nowrap">
                  Our Latest <span className="text-gradient-red">Blogs</span>
                </h1>
                
                <p className="text-base md:text-lg text-[var(--text-muted)] max-w-2xl mb-6 leading-relaxed font-medium">
                  Explore in-depth tutorials, industry trends, and the latest updates from Masterstroke Academy to elevate your skills to the next level.
                </p>
              </motion.div>
            </div>

            {/* Featured Blog - Right Side */}
            <div className="w-full max-w-sm lg:w-[320px] shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {loading ? (
                   <div className="flex justify-center items-center h-48">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31e24]"></div>
                   </div>
                ) : featuredBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {featuredBlogs.map(blog => renderBlogCard(blog, true))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-48 text-[var(--text-muted)] italic">
                    No featured blogs available
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Listing Section */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Filters */}
          <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search blogs by title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:bg-white transition-all text-black"
              />
            </div>
            <div className="relative w-full md:max-w-xs flex items-center gap-2">
              <div className="relative w-full">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:bg-white transition-all text-black"
                />
              </div>
              {dateFilter && (
                <button 
                  onClick={() => setDateFilter("")}
                  className="text-sm text-[#e31e24] hover:underline whitespace-nowrap font-medium"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e31e24]"></div>
             </div>
          ) : regularBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBlogs.map((blog) => renderBlogCard(blog, false))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[var(--bg-muted)] rounded-2xl border border-[var(--border)]">
              <p className="text-xl text-[var(--text-muted)]">No regular blogs found matching your filters.</p>
              <button 
                onClick={() => { setSearchQuery(""); setDateFilter(""); }}
                className="mt-4 px-6 py-2 bg-[var(--mst-red)] text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
