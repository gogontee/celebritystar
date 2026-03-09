'use client'
import React from 'react'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import IconButton from './IconButton'
import { Heart, Star, Vote, ArrowRight, UserPlus, Trash2, Share2 } from 'lucide-react'

export default function ButtonDemo() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Button Components</h2>
      
      {/* Voting Button Example */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Voting Button (Main Action)</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button 
            variant="vote"
            size="lg"
            leftIcon={Heart}
          >
            Vote for Lucy
          </Button>
          <Button 
            variant="vote"
            size="xl"
            leftIcon={Star}
          >
            ⭐ 500 Votes - ₦5,000
          </Button>
        </div>
      </div>
      
      {/* Primary Buttons */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Primary Gradient (Burnt Orange → Lemon)</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Default</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button leftIcon={UserPlus}>Join Now</Button>
          <Button rightIcon={ArrowRight}>Continue</Button>
          <Button isLoading>Loading...</Button>
          <Button disabled>Disabled</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </div>
      
      {/* All Variants */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">All Button Variants</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger" leftIcon={Trash2}>Delete</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="text">Text</Button>
        </div>
      </div>
      
      {/* Icon Buttons */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Icon Buttons</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <IconButton icon={Heart} variant="primary" label="Like" />
          <IconButton icon={Share2} variant="secondary" label="Share" />
          <IconButton icon={Star} variant="ghost" label="Star" />
          <IconButton icon={Vote} variant="vote" size="lg" label="Vote" />
          <IconButton icon={Trash2} variant="danger" label="Delete" />
        </div>
      </div>
      
      {/* Button Group */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Button Groups (Vote Packages)</h3>
        <ButtonGroup>
          <Button variant="secondary">10 Votes - ₦1,000</Button>
          <Button variant="primary">50 Votes - ₦5,000</Button>
          <Button variant="secondary">100 Votes - ₦9,500</Button>
          <Button variant="vote">500 Votes - ₦45,000</Button>
        </ButtonGroup>
        
        <div className="mt-6">
          <ButtonGroup orientation="vertical" className="max-w-xs">
            <Button variant="ghost">Profile Settings</Button>
            <Button variant="ghost">Gallery Management</Button>
            <Button variant="ghost">Vote Statistics</Button>
            <Button variant="ghost">Payment History</Button>
          </ButtonGroup>
        </div>
      </div>
      
      {/* Real Usage Examples */}
      <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Real Platform Usage</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidate Action Buttons */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Candidate Actions</h4>
            <Button variant="primary" leftIcon={UserPlus} fullWidth>
              Join The Competition
            </Button>
            <Button variant="secondary" fullWidth>
              Edit My Profile
            </Button>
            <Button variant="ghost" fullWidth>
              View Analytics
            </Button>
          </div>
          
          {/* Voter Action Buttons */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Voter Actions</h4>
            <Button variant="vote" size="lg" leftIcon={Heart} fullWidth>
              Vote Now (10 Votes - ₦1,000)
            </Button>
            <Button variant="primary" leftIcon={Star} fullWidth>
              Buy Vote Package
            </Button>
            <Button variant="text" fullWidth>
              Share Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}