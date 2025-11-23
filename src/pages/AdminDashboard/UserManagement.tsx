import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
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
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, User, Shield, Mail, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
    id: string;
    full_name: string | null;
    email: string | null; // Note: email is not in profiles table by default, might need to fetch from auth or assume it's synced if added
    phone: string | null;
    role: "user" | "agent" | "admin";
    created_at: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [newRole, setNewRole] = useState<"user" | "agent" | "admin">("user");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Fetch profiles and their roles
            const { data: profiles, error: profilesError } = await supabase
                .from("profiles")
                .select("*");

            if (profilesError) throw profilesError;

            const { data: roles, error: rolesError } = await supabase
                .from("user_roles")
                .select("*");

            if (rolesError) throw rolesError;

            // Merge profiles with roles
            const mergedUsers = profiles.map((profile) => {
                const userRole = roles.find((r) => r.user_id === profile.id);
                return {
                    ...profile,
                    role: userRole?.role || "user",
                    // Email is not in public profiles usually for security, 
                    // but if we have it in profiles table we use it. 
                    // If not, we might need a secure function to get it or just show name.
                    // For now assuming profiles has email or we just show name.
                };
            });

            setUsers(mergedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async () => {
        if (!selectedUser) return;

        try {
            setProcessing(true);

            // We need to update the user_roles table
            // First check if a role entry exists
            const { data: existingRole } = await supabase
                .from("user_roles")
                .select("*")
                .eq("user_id", selectedUser.id)
                .single();

            let error;

            if (existingRole) {
                const { error: updateError } = await supabase
                    .from("user_roles")
                    .update({ role: newRole })
                    .eq("user_id", selectedUser.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from("user_roles")
                    .insert({ user_id: selectedUser.id, role: newRole });
                error = insertError;
            }

            if (error) throw error;

            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
            setIsRoleDialogOpen(false);
        } catch (error: any) {
            console.error("Error updating role:", error);
            toast.error(error.message || "Failed to update role");
        } finally {
            setProcessing(false);
        }
    };

    const filteredUsers = users.filter((user) =>
        (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            admin: "destructive",
            agent: "default",
            user: "secondary",
        };
        return (
            <Badge variant={variants[role] || "outline"}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">Manage system users and roles</p>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage system users and roles</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Users ({users.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.full_name || "Unknown"}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>
                                        {user.created_at ? format(new Date(user.created_at), "MMM dd, yyyy") : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setNewRole(user.role);
                                                setIsRoleDialogOpen(true);
                                            }}
                                        >
                                            <Shield className="h-4 w-4 mr-2" />
                                            Manage Role
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage User Role</DialogTitle>
                        <DialogDescription>
                            Change the role for {selectedUser?.full_name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Select Role</label>
                        <Select
                            value={newRole}
                            onValueChange={(value: "user" | "agent" | "admin") => setNewRole(value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="agent">Agent</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRoleDialogOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleRoleUpdate} disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
