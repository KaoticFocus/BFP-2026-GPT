// BuildFlow Pro AI - Supabase Database Types
// Auto-generated - Run `pnpm db:types` to regenerate
// Generated: 2026-01-11

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          org_id: string
          role: 'owner' | 'admin' | 'manager' | 'tech' | 'sales' | 'viewer'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          org_id: string
          role: 'owner' | 'admin' | 'manager' | 'tech' | 'sales' | 'viewer'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          org_id?: string
          role?: 'owner' | 'admin' | 'manager' | 'tech' | 'sales' | 'viewer'
          created_at?: string | null
          updated_at?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          org_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          org_id: string
          customer_id: string | null
          name: string
          source: string | null
          status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
          project_type: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          customer_id?: string | null
          name: string
          source?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
          project_type?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          customer_id?: string | null
          name?: string
          source?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
          project_type?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          org_id: string
          lead_id: string | null
          customer_id: string | null
          name: string
          status: 'lead' | 'proposal' | 'contracted' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
          address: string | null
          start_date: string | null
          end_date: string | null
          contract_amount: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          lead_id?: string | null
          customer_id?: string | null
          name: string
          status?: 'lead' | 'proposal' | 'contracted' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
          address?: string | null
          start_date?: string | null
          end_date?: string | null
          contract_amount?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          lead_id?: string | null
          customer_id?: string | null
          name?: string
          status?: 'lead' | 'proposal' | 'contracted' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
          address?: string | null
          start_date?: string | null
          end_date?: string | null
          contract_amount?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          org_id: string
          project_id: string | null
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled'
          priority: number
          due_date: string | null
          created_by_id: string | null
          assignee_id: string | null
          source_type: string | null
          source_id: string | null
          completed_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          project_id?: string | null
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled'
          priority?: number
          due_date?: string | null
          created_by_id?: string | null
          assignee_id?: string | null
          source_type?: string | null
          source_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          project_id?: string | null
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled'
          priority?: number
          due_date?: string | null
          created_by_id?: string | null
          assignee_id?: string | null
          source_type?: string | null
          source_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      vendors: {
        Row: {
          id: string
          org_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          type: 'vendor' | 'subcontractor'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          type: 'vendor' | 'subcontractor'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          type?: 'vendor' | 'subcontractor'
          created_at?: string | null
          updated_at?: string | null
        }
      }
      cost_codes: {
        Row: {
          id: string
          org_id: string
          code: string
          name: string
          description: string | null
          category: 'labor' | 'material' | 'equipment' | 'subcontract' | 'other' | null
          active: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          code: string
          name: string
          description?: string | null
          category?: 'labor' | 'material' | 'equipment' | 'subcontract' | 'other' | null
          active?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          code?: string
          name?: string
          description?: string | null
          category?: 'labor' | 'material' | 'equipment' | 'subcontract' | 'other' | null
          active?: boolean
          created_at?: string | null
        }
      }
      // Additional tables follow the same pattern...
      // Full types can be regenerated with: pnpm db:types
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Common entity types
export type Organization = Tables<'organizations'>
export type User = Tables<'users'>
export type Membership = Tables<'memberships'>
export type Customer = Tables<'customers'>
export type Lead = Tables<'leads'>
export type Project = Tables<'projects'>
export type Task = Tables<'tasks'>
export type Vendor = Tables<'vendors'>
export type CostCode = Tables<'cost_codes'>

// Role type
export type Role = 'owner' | 'admin' | 'manager' | 'tech' | 'sales' | 'viewer'

// Project status type
export type ProjectStatus = 'lead' | 'proposal' | 'contracted' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'

// Task status type
export type TaskStatus = 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled'

// Lead status type
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
