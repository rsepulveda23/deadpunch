
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Calendar, Edit, Trash, Plus, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Define types for blog posts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Function to fetch blog posts from Supabase
const fetchBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
  
  return data;
};

// Function to check if a user is logged in with admin privileges
const checkAdminAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session?.user; // In a real app, you'd check for admin role here
};

const BlogAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAdmin = await checkAdminAuth();
        setIsAuthenticated(isAdmin);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      // Redirect to login page when we build one
      toast.error('You must be logged in to access the admin dashboard');
      navigate('/blog');
    }
  }, [isCheckingAuth, isAuthenticated, navigate]);

  // Fetch blog posts
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['adminBlogPosts'],
    queryFn: fetchBlogPosts,
    enabled: isAuthenticated
  });

  // Mutation for creating a new blog post
  const createPostMutation = useMutation({
    mutationFn: async (newPostData: typeof newPost) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...newPostData,
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      setIsCreateDialogOpen(false);
      setNewPost({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
      });
      toast.success('Blog post created successfully');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error('Failed to create blog post');
    }
  });

  // Mutation for updating a blog post
  const updatePostMutation = useMutation({
    mutationFn: async (updatedPost: BlogPost) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...updatedPost,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedPost.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
      setIsEditDialogOpen(false);
      setEditingPost(null);
      toast.success('Blog post updated successfully');
    },
    onError: (error) => {
      console.error('Error updating post:', error);
      toast.error('Failed to update blog post');
    }
  });

  // Mutation for deleting a blog post
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
      toast.success('Blog post deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete blog post');
    }
  });

  // Handle post creation
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate(newPost);
  };

  // Handle post update
  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updatePostMutation.mutate(editingPost);
    }
  };

  // Handle post deletion
  const handleDeletePost = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete.id);
    }
  };

  // Open edit dialog with post data
  const openEditDialog = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Handle title change in new post form
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, isNewPost = true) => {
    const title = e.target.value;
    if (isNewPost) {
      setNewPost({
        ...newPost,
        title,
        slug: generateSlug(title)
      });
    } else {
      if (editingPost) {
        setEditingPost({
          ...editingPost,
          title,
          slug: generateSlug(title)
        });
      }
    }
  };

  return (
    <main className="relative min-h-screen">
      <div className="noise-overlay"></div>
      
      <Navbar />
      
      <section className="pt-32 pb-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <Button 
              variant="ghost" 
              className="text-deadpunch-gray-light hover:text-white"
              onClick={() => navigate('/blog')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Button>
            
            <Button 
              variant="default" 
              className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus size={16} className="mr-2" />
              New Post
            </Button>
          </div>
          
          <div className="glass p-8 rounded-xl mb-6">
            <h1 className="text-3xl font-display font-bold mb-4">Blog Admin Dashboard</h1>
            <p className="text-deadpunch-gray-light mb-6">Manage your blog posts here. Create, edit or delete posts as needed.</p>
            
            <Separator className="mb-6 bg-deadpunch-dark-lighter" />
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-64 bg-deadpunch-dark-lighter rounded mb-4"></div>
                  <div className="h-4 w-48 bg-deadpunch-dark-lighter rounded"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center text-deadpunch-red py-6">
                <p>Error loading blog posts. Please try again.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>A list of your blog posts</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Published Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts?.map((post: BlogPost) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.slug}</TableCell>
                        <TableCell>
                          {post.published_at 
                            ? format(parseISO(post.published_at), 'MMM d, yyyy') 
                            : 'Unpublished'}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-deadpunch-dark-lighter hover:bg-deadpunch-dark-lighter"
                            onClick={() => openEditDialog(post)}
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => openDeleteDialog(post)}
                          >
                            <Trash size={14} className="mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-deadpunch-dark border-deadpunch-gray-dark max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Create New Blog Post</DialogTitle>
            <DialogDescription>Fill out the form below to create a new blog post.</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreatePost} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newPost.title} 
                  onChange={(e) => handleTitleChange(e)}
                  placeholder="Blog Post Title"
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input 
                  id="slug" 
                  value={newPost.slug} 
                  onChange={(e) => setNewPost({...newPost, slug: e.target.value})}
                  placeholder="blog-post-slug"
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <Input 
                id="featured_image" 
                value={newPost.featured_image} 
                onChange={(e) => setNewPost({...newPost, featured_image: e.target.value})}
                placeholder="https://example.com/image.jpg"
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea 
                id="excerpt" 
                value={newPost.excerpt} 
                onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                placeholder="A brief summary of the post"
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea 
                id="content" 
                value={newPost.content} 
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="<p>Your blog post content here (HTML format)</p>"
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark min-h-[200px]"
                required
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-deadpunch-gray-dark"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-deadpunch-dark border-deadpunch-gray-dark max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Edit Blog Post</DialogTitle>
            <DialogDescription>Update the blog post details.</DialogDescription>
          </DialogHeader>
          
          {editingPost && (
            <form onSubmit={handleUpdatePost} className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input 
                    id="edit-title" 
                    value={editingPost.title} 
                    onChange={(e) => handleTitleChange(e, false)}
                    className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input 
                    id="edit-slug" 
                    value={editingPost.slug} 
                    onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                    className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-featured_image">Featured Image URL</Label>
                <Input 
                  id="edit-featured_image" 
                  value={editingPost.featured_image || ''} 
                  onChange={(e) => setEditingPost({...editingPost, featured_image: e.target.value})}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea 
                  id="edit-excerpt" 
                  value={editingPost.excerpt || ''} 
                  onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content (HTML)</Label>
                <Textarea 
                  id="edit-content" 
                  value={editingPost.content} 
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark min-h-[200px]"
                  required
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-deadpunch-gray-dark"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
                  disabled={updatePostMutation.isPending}
                >
                  {updatePostMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-deadpunch-dark border-deadpunch-gray-dark">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {postToDelete && (
            <div className="py-4">
              <p className="font-medium">{postToDelete.title}</p>
              <p className="text-deadpunch-gray-light text-sm mt-1">
                {postToDelete.published_at 
                  ? `Published on ${format(parseISO(postToDelete.published_at), 'MMMM d, yyyy')}` 
                  : 'Unpublished'}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-deadpunch-gray-dark"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePost}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? 'Deleting...' : 'Delete Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default BlogAdmin;
