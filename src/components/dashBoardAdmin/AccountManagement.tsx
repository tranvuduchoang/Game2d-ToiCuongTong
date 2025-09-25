import { useState } from 'react';
import { Card } from '../game/ui/card';
import { Button } from '../game/ui/button';
import { Input } from '../game/ui/input';
import { Label } from '../game/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../game/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../game/ui/table';
import { Badge } from '../game/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../game/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../game/ui/alert-dialog';
import { Search, UserPlus, Shield, User, Crown, Trash2, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Account {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'subAdmin' | 'admin';
  status: 'active' | 'banned' | 'inactive';
  level: number;
  sect: string;
  lastLogin: string;
  createdAt: string;
}

export function AccountManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      username: 'TieuDaoThan123',
      email: 'player1@example.com',
      role: 'user',
      status: 'active',
      level: 45,
      sect: 'Thiên Kiếm Tông',
      lastLogin: '2024-01-15 14:30',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      username: 'VoLamKiemKhach',
      email: 'player2@example.com',
      role: 'subAdmin',
      status: 'active',
      level: 78,
      sect: 'Huyền Thiên Tông',
      lastLogin: '2024-01-15 12:15',
      createdAt: '2023-12-15'
    },
    {
      id: '3',
      username: 'ThienHaVoSong',
      email: 'player3@example.com',
      role: 'user',
      status: 'banned',
      level: 23,
      sect: 'Vô Cực Tông',
      lastLogin: '2024-01-10 09:20',
      createdAt: '2024-01-05'
    }
  ]);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || account.role === filterRole;
    const matchesStatus = filterStatus === 'all' || account.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newAccount: Account = {
      id: Date.now().toString(),
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'user' | 'subAdmin' | 'admin',
      status: 'active',
      level: 1,
      sect: 'Chưa gia nhập',
      lastLogin: 'Chưa đăng nhập',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setAccounts([...accounts, newAccount]);
    setIsCreateDialogOpen(false);
    toast.success(`Tài khoản ${newAccount.username} đã được tạo thành công!`);
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
    toast.success('Tài khoản đã được xóa thành công!');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4" />;
      case 'subAdmin':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary text-primary-foreground';
      case 'subAdmin':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'banned':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Quản lý tài khoản</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="martial-glow">
              <UserPlus className="w-4 h-4 mr-2" />
              Tạo tài khoản mới
            </Button>
          </DialogTrigger>
          <DialogContent className="ancient-scroll">
            <DialogHeader>
              <DialogTitle className="text-primary">Tạo tài khoản mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên tài khoản</Label>
                <Input id="username" name="username" placeholder="Nhập tên tài khoản" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Nhập email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" name="password" type="password" placeholder="Nhập mật khẩu" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Quyền hạn</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quyền hạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="subAdmin">Sub Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" className="martial-glow">
                  Tạo tài khoản
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-6 ancient-scroll">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <Label htmlFor="search">Tìm kiếm</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Tìm theo tên tài khoản hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="min-w-40">
            <Label>Quyền hạn</Label>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="subAdmin">Sub Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-40">
            <Label>Trạng thái</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="banned">Bị cấm</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Accounts Table */}
      <Card className="ancient-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tài khoản</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Quyền hạn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Tông môn</TableHead>
              <TableHead>Đăng nhập cuối</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.username}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>
                  <Badge className={`${getRoleColor(account.role)} flex items-center gap-1 w-fit`}>
                    {getRoleIcon(account.role)}
                    {account.role === 'admin' ? 'Admin' : 
                     account.role === 'subAdmin' ? 'Sub Admin' : 'Người dùng'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(account.status)}>
                    {account.status === 'active' ? 'Hoạt động' :
                     account.status === 'banned' ? 'Bị cấm' : 'Không hoạt động'}
                  </Badge>
                </TableCell>
                <TableCell>{account.level}</TableCell>
                <TableCell>{account.sect}</TableCell>
                <TableCell>{account.lastLogin}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="ancient-scroll">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa tài khoản "{account.username}"? 
                            Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteAccount(account.id)}
                            className="bg-destructive hover:bg-destructive/80"
                          >
                            Xóa tài khoản
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}