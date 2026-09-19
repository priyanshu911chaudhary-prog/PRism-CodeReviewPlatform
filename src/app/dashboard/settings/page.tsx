"use client";

import { ProfilePage } from '@/modules/settings/components/ProfileForm';
import { RepositoryList } from '@/modules/settings/components/RepositoryList';
import React from 'react'

const SettingPage = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and connected services</p>
            </div>
            
            <div className="grid gap-6">
                <ProfilePage />
                <RepositoryList />
            </div>
        </div>
    )
}

export default SettingPage;