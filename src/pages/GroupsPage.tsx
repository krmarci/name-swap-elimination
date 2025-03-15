
import { useState } from "react";
import { useNames } from "@/context/NameContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NavBar from "@/components/NavBar";
import { Plus, Users, User, UserPlus, UsersRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const GroupsPage = () => {
  const { groups, createGroup, joinGroup, currentGroup, setCurrentGroup, getGroupById, getUserRanking, getGroupRanking } = useNames();
  const { toast } = useToast();
  const [newGroupName, setNewGroupName] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [genderTab, setGenderTab] = useState<string>("boys");
  
  const activeGroup = currentGroup ? getGroupById(currentGroup) : null;
  const groupBoyRankings = activeGroup ? getGroupRanking(activeGroup.id, "boy") : [];
  const groupGirlRankings = activeGroup ? getGroupRanking(activeGroup.id, "girl") : [];
  
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }
    
    const group = createGroup(newGroupName);
    setCurrentGroup(group.id);
    setNewGroupName("");
    setActiveTab("rankings");
  };
  
  const handleJoinGroup = () => {
    if (!joinGroupId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group ID",
        variant: "destructive",
      });
      return;
    }
    
    const success = joinGroup(joinGroupId);
    if (success) {
      setCurrentGroup(joinGroupId);
      setJoinGroupId("");
      setActiveTab("rankings");
    }
  };
  
  const handleSelectGroup = (groupId: string) => {
    setCurrentGroup(groupId);
    setActiveTab("rankings");
  };
  
  const copyGroupId = (groupId: string) => {
    navigator.clipboard.writeText(groupId);
    toast({
      title: "Copied",
      description: "Group ID copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Groups</h1>
          <p className="text-xl text-gray-600">
            Create and join groups to compare name rankings with others.
            {activeGroup && (
              <span className="font-medium"> Active group: {activeGroup.name}</span>
            )}
          </p>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="overview">
                Groups Overview
              </TabsTrigger>
              <TabsTrigger value="rankings" disabled={!activeGroup}>
                Group Rankings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Create/Join Group */}
              <div className="space-y-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="mr-2 h-5 w-5" />
                      Create New Group
                    </CardTitle>
                    <CardDescription>
                      Create a new group and share the ID with others.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="group-name">Group Name</Label>
                        <Input
                          id="group-name"
                          placeholder="Enter group name"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleCreateGroup}
                    >
                      Create Group
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Join Existing Group
                    </CardTitle>
                    <CardDescription>
                      Enter a group ID to join an existing group.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="group-id">Group ID</Label>
                        <Input
                          id="group-id"
                          placeholder="Enter group ID"
                          value={joinGroupId}
                          onChange={(e) => setJoinGroupId(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleJoinGroup}
                    >
                      Join Group
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Your Groups */}
              <Card className="shadow-md h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UsersRound className="mr-2 h-5 w-5" />
                    Your Groups
                  </CardTitle>
                  <CardDescription>
                    Groups you have created or joined.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="p-4">
                      {groups.length > 0 ? (
                        groups.map((group) => (
                          <div
                            key={group.id}
                            className="p-4 mb-4 border rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{group.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSelectGroup(group.id)}
                                className={currentGroup === group.id ? "bg-primary/20" : ""}
                              >
                                {currentGroup === group.id ? "Active" : "Select"}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="truncate text-gray-500 max-w-[150px]">
                                ID: {group.id}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyGroupId(group.id)}
                              >
                                Copy ID
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                          <p>No groups yet</p>
                          <p className="text-sm">Create or join a group to get started</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="rankings">
            {activeGroup && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-semibold">{activeGroup.name} Rankings</h2>
                  <p className="text-gray-600">
                    Rankings based on collective votes from all group members
                  </p>
                </div>
                
                <Tabs defaultValue="boys" value={genderTab} onValueChange={setGenderTab}>
                  <div className="flex justify-center mb-8">
                    <TabsList className="grid w-[400px] grid-cols-2">
                      <TabsTrigger value="boys" className="text-boy">
                        Boy Names
                      </TabsTrigger>
                      <TabsTrigger value="girls" className="text-girl">
                        Girl Names
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="boys">
                    <Card className="shadow-lg border-boy border-t-4">
                      <CardHeader className="bg-boy-light">
                        <CardTitle className="flex items-center text-boy-dark">
                          <Users className="mr-2 h-5 w-5" />
                          Group Boy Name Rankings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[60vh]">
                          <div className="p-4">
                            {groupBoyRankings.length > 0 ? (
                              groupBoyRankings.map((name, index) => (
                                <div
                                  key={name.id}
                                  className="flex justify-between items-center py-2 border-b border-gray-100"
                                >
                                  <div className="flex items-center">
                                    <span className="w-8 text-center font-bold text-gray-500">
                                      {index + 1}
                                    </span>
                                    <span className="font-medium">{name.name}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {Math.round(name.elo)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                                <p>No group votes yet</p>
                                <p className="text-sm">Vote on names while in group mode</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="girls">
                    <Card className="shadow-lg border-girl border-t-4">
                      <CardHeader className="bg-girl-light">
                        <CardTitle className="flex items-center text-girl-dark">
                          <Users className="mr-2 h-5 w-5" />
                          Group Girl Name Rankings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[60vh]">
                          <div className="p-4">
                            {groupGirlRankings.length > 0 ? (
                              groupGirlRankings.map((name, index) => (
                                <div
                                  key={name.id}
                                  className="flex justify-between items-center py-2 border-b border-gray-100"
                                >
                                  <div className="flex items-center">
                                    <span className="w-8 text-center font-bold text-gray-500">
                                      {index + 1}
                                    </span>
                                    <span className="font-medium">{name.name}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {Math.round(name.elo)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                                <p>No group votes yet</p>
                                <p className="text-sm">Vote on names while in group mode</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GroupsPage;
