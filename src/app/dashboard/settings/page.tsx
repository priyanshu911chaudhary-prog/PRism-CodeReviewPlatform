"use client";

import { ProfilePage } from '@/modules/settings/components/ProfileForm';
import { RepositoryList } from '@/modules/settings/components/RepositoryList';
import { PageHeader } from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react'

const SettingPage = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            <PageHeader 
                title="Settings" 
                description="Manage your account settings and connected services" 
            />
            
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-0 outline-none">
                    <ProfilePage />
                </TabsContent>
                <TabsContent value="repositories" className="mt-0 outline-none">
                    <RepositoryList />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SettingPage;