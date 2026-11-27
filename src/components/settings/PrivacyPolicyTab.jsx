import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldCheck,
  Plus,
  Save,
  FileText,
  Layers,
  ListOrdered,
  AlertCircle,
  Loader2,
  ChevronDown,
  Pencil,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import Pagination from '../common/Pagination';
import RichTextEditor from '../common/RichTextEditor';
import {
  getPoliciesApi,
  createPolicyApi,
  updatePolicyApi,
  getPolicyByIdApi,
  updatePolicyStatusApi,
  deletePolicyApi,
} from '../../services/policy.services';

export default function PrivacyPolicyTab() {
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState('all');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);

  const [formRoleDropdownOpen, setFormRoleDropdownOpen] = useState(false);
  const formRoleDropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [expandedPolicyId, setExpandedPolicyId] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(e.target)
      ) {
        setRoleDropdownOpen(false);
      }
      if (
        formRoleDropdownRef.current &&
        !formRoleDropdownRef.current.contains(e.target)
      ) {
        setFormRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form State for Add / Edit Policy
  const [editingId, setEditingId] = useState(null);
  const [fetchingPolicyId, setFetchingPolicyId] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [role, setRole] = useState('all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sortOrder, setSortOrder] = useState('1');
  const [formError, setFormError] = useState('');

  // ========================================
  // GET POLICIES API QUERY
  // ========================================
  const {
    data: policiesResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['policies', currentPage, entriesPerPage],
    queryFn: () =>
      getPoliciesApi({
        page: currentPage,
        limit: entriesPerPage,
      }),
  });

  const policies = policiesResponse?.data || [];
  const meta = policiesResponse?.meta;

  // Filter by role: all | driver | user
  const filteredPolicies =
    roleFilter && roleFilter !== 'all'
      ? policies.filter(
          (p) => (p.role || '').toLowerCase() === roleFilter.toLowerCase()
        )
      : policies;

  const totalItems =
    roleFilter && roleFilter !== 'all'
      ? filteredPolicies.length
      : (meta?.total ?? policies.length);
  const totalPages = Math.max(1, Math.ceil(totalItems / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const displayPolicies =
    roleFilter && roleFilter !== 'all'
      ? filteredPolicies.slice(
          (safePage - 1) * entriesPerPage,
          safePage * entriesPerPage
        )
      : filteredPolicies;

  // ========================================
  // CREATE POLICY API MUTATION
  // ========================================
  const createPolicyMutation = useMutation({
    mutationFn: createPolicyApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success(res?.message || 'Privacy Policy created successfully!');
      handleResetForm();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        'Failed to create Privacy Policy. Please try again.';
      setFormError(msg);
      toast.error(msg);
    },
  });

  // ========================================
  // UPDATE POLICY API MUTATION
  // ========================================
  const updatePolicyMutation = useMutation({
    mutationFn: updatePolicyApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success(res?.message || 'Privacy Policy updated successfully!');
      handleResetForm();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        'Failed to update Privacy Policy. Please try again.';
      setFormError(msg);
      toast.error(msg);
    },
  });

  // ========================================
  // UPDATE POLICY STATUS API
  // ========================================
  const updateStatusMutation = useMutation({
    mutationFn: updatePolicyStatusApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['policies'],
      });
      toast.success(response?.message || 'Status updated successfully');
      setStatusModal(null);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || 'Failed to update policy status.'
      );
    },
  });

  // ========================================
  // DELETE POLICY API MUTATION
  // ========================================
  const deletePolicyMutation = useMutation({
    mutationFn: deletePolicyApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success(res?.message || 'Privacy Policy deleted successfully!');
      const deletedId = deleteModal?.id ?? deleteModal?._id;
      setDeleteModal(null);
      if (editingId && editingId === deletedId) {
        handleResetForm();
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          'Failed to delete Privacy Policy. Please try again.'
      );
    },
  });

  // ========================================
  // FORM HANDLERS
  // ========================================
  const handleResetForm = () => {
    setEditingId(null);
    setRole('all');
    setFormRoleDropdownOpen(false);
    setTitle('');
    setContent('');
    setSortOrder(String((meta?.total ?? policies.length) + 1));
    setFormError('');
  };

  const handleEdit = async (policy) => {
    const id = policy.id ?? policy._id;
    if (!id) return;
    setFetchingPolicyId(id);
    setFormError('');
    try {
      const res = await getPolicyByIdApi(id);
      const policyData = res?.data?.data || res?.data || policy;
      setEditingId(policyData.id ?? policyData._id ?? id);
      setRole((policyData.role || 'all').toLowerCase());
      setFormRoleDropdownOpen(false);
      setTitle(policyData.title || '');
      setContent(policyData.content || '');
      setSortOrder(String(policyData.sortOrder ?? 1));
      const formEl = document.getElementById('policy-form-card');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to fetch policy details.'
      );
    } finally {
      setFetchingPolicyId(null);
    }
  };

  const handleSavePolicy = (e) => {
    e?.preventDefault();

    if (!title.trim()) {
      setFormError('Please enter a policy title.');
      return;
    }

    // Strip HTML tags to ensure actual text was entered
    const cleanContentText = content.replace(/<[^>]*>/g, '').trim();
    if (!cleanContentText && !content.includes('<img')) {
      setFormError('Please enter policy content.');
      return;
    }

    setFormError('');

    const payload = {
      role: role.trim(),
      title: title.trim(),
      content: content.trim(),
      sortOrder: Number(sortOrder) || 1,
    };

    if (editingId) {
      updatePolicyMutation.mutate({ id: editingId, ...payload });
    } else {
      createPolicyMutation.mutate(payload);
    }
  };

  const toggleExpand = (id) => {
    setExpandedPolicyId((prev) => (prev === id ? null : id));
  };

  // Helper for role badges: user | driver | all
  const renderRoleBadge = (r) => {
    const roleKey = (r || 'all').toLowerCase();
    let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';

    if (roleKey === 'driver') {
      badgeClasses = 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (roleKey === 'user') {
      badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    } else if (roleKey === 'all') {
      badgeClasses = 'bg-purple-50 text-purple-700 border-purple-200';
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[13px] font-bold border capitalize ${badgeClasses}`}
      >
        {roleKey !== 'all' && (
          <span
            className={`w-2 h-2 rounded-full ${
              roleKey === 'driver' ? 'bg-blue-500' : 'bg-amber-500'
            }`}
          />
        )}
        {roleKey}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
      {/* ----------------- LEFT: Policies Table (col-span-8) ----------------- */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        {/* Table Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-bold text-black leading-tight">
                Privacy Policies
              </h2>
              {isFetching && (
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Manage app privacy policies, terms & conditions across roles.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            {/* Custom Role Filter Dropdown (Styled like FAQs / Drivers Table) */}
            <div ref={roleDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="w-full sm:w-36 flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
              >
                <span className="truncate capitalize">{roleFilter}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    roleDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                  {['all', 'driver', 'user'].map((r) => {
                    const isSelected = roleFilter === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRoleFilter(r);
                          setRoleDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer capitalize ${
                          isSelected
                            ? 'bg-[#fed011] text-black shadow-2xs font-bold'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Focus Add Policy Form Button */}
            <button
              onClick={() => {
                document.getElementById('policy-title-input')?.focus();
                document
                  .getElementById('policy-form-card')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#fed011] hover:bg-amber-400 text-black px-3.5 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.4]" />
              <span>Add Policy</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[580px] text-left border-collapse">
              <thead>
                <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-[12px] sm:text-[13px] font-bold text-slate-900">
                  <th className="py-2.5 px-3 pl-4 text-center w-12 sm:w-14">#</th>
                  <th className="py-2.5 px-3 w-24">Role</th>
                  <th className="py-2.5 px-3">Title & Content</th>
                  <th className="py-2.5 px-3 text-center w-20">Order</th>
                  <th className="py-2.5 px-3 text-center w-24">Status</th>
                  <th className="py-2.5 px-3 pr-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] sm:text-[14px] text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
                        <span className="font-semibold text-xs sm:text-sm text-slate-500">
                          Loading Privacy Policies...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-rose-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <AlertCircle className="w-7 h-7 text-rose-500" />
                        <p className="font-bold text-sm">
                          {error?.response?.data?.message ||
                            'Failed to load Privacy Policies.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : displayPolicies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <p className="font-bold text-sm text-slate-600">
                          No Privacy Policies Found
                        </p>
                        <p className="text-xs text-slate-400 max-w-sm">
                          {roleFilter !== 'all'
                            ? `No policies found for role "${roleFilter}". Try selecting "all".`
                            : 'Create your first Privacy Policy using the form on the right.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayPolicies.map((policy, index) => {
                    const policyId = policy.id ?? policy._id;
                    const isExpanded = expandedPolicyId === policyId;
                    const isActive =
                      (policy.status || 'active').toLowerCase() === 'active';

                    return (
                      <tr
                        key={policyId ?? index}
                        className="hover:bg-slate-50/70 transition-colors align-top"
                      >
                        {/* ID from API */}
                        <td className="py-3 px-3 pl-4 text-center text-slate-900 font-bold text-xs sm:text-sm">
                          {policy.id ?? policy._id ?? '-'}
                        </td>

                        {/* Role Badge */}
                        <td className="py-3 px-3">
                          {renderRoleBadge(policy.role)}
                        </td>

                        {/* Title & Expandable Content */}
                        <td className="py-2.5 px-3">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-slate-900 text-sm sm:text-[14px] leading-tight">
                                {policy.title}
                              </p>
                              {policy.content && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(policyId)}
                                  className="p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                                  title={
                                    isExpanded ? 'Hide Content' : 'Show Content'
                                  }
                                >
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Content preview: Shown when expanded */}
                            {isExpanded && policy.content && (
                              <div
                                className="mt-2 p-2.5 bg-slate-50 rounded-xl text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed border border-slate-100 prose prose-xs max-w-none break-words"
                                dangerouslySetInnerHTML={{
                                  __html: policy.content,
                                }}
                              />
                            )}
                          </div>
                        </td>

                        {/* Sort Order */}
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-md bg-slate-100 text-slate-700 font-bold text-xs sm:text-[13px] border border-slate-200">
                            {policy.sortOrder ?? '-'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const current = (
                                policy.status || 'active'
                              ).toLowerCase();
                              const next =
                                current === 'active' ? 'inactive' : 'active';
                              setStatusModal({
                                policy,
                                currentStatus: current,
                                nextStatus: next,
                              });
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer hover:shadow-2xs active:scale-95 ${
                              isActive
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70'
                                : 'text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100/70'
                            }`}
                            title={`Click to change status to ${
                              isActive ? 'Inactive' : 'Active'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isActive ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span className="capitalize">
                              {policy.status || 'Active'}
                            </span>
                          </button>
                        </td>

                        {/* Action */}
                        <td className="py-2.5 px-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(policy)}
                              disabled={fetchingPolicyId === policyId}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
                              title="Edit Policy"
                            >
                              {fetchingPolicyId === policyId ? (
                                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                              ) : (
                                <Pencil className="w-4 h-4 stroke-[2]" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteModal(policy)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Policy"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          {totalItems > 0 && (
            <Pagination
              currentPage={safePage}
              totalItems={totalItems}
              itemsPerPage={entriesPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(n) => {
                setEntriesPerPage(n);
                setCurrentPage(1);
              }}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          )}
        </div>
      </div>

      {/* ----------------- RIGHT: Add / Edit Policy Form Card (col-span-4) ----------------- */}
      <div
        id="policy-form-card"
        className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-4 space-y-3 self-start"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
              {editingId ? (
                <Pencil className="w-3.5 h-3.5 stroke-[2.4]" />
              ) : (
                <Plus className="w-3.5 h-3.5 stroke-[2.4]" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-black">
                {editingId ? 'Edit Privacy Policy' : 'Add Privacy Policy'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                {editingId
                  ? 'Update privacy policy details'
                  : 'Create privacy policy or terms'}
              </p>
            </div>
          </div>

          {editingId && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-100 text-amber-900 border border-amber-200">
              ID: #{editingId}
            </span>
          )}
        </div>

        {/* Error Message */}
        {formError && (
          <div className="flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-semibold animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSavePolicy} className="space-y-2.5">
          {/* Role Field - Custom Theme Dropdown */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Role <span className="text-red-500">*</span>
            </label>
            <div ref={formRoleDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setFormRoleDropdownOpen(!formRoleDropdownOpen)}
                className="w-full flex items-center justify-between pl-8.5 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 hover:bg-white focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer shadow-2xs text-left"
              >
                <Layers className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <span className="capitalize">{role}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                    formRoleDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Custom Dropdown Popup */}
              {formRoleDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                  {['all', 'driver', 'user'].map((r) => {
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setFormRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer capitalize ${
                          isSelected
                            ? 'bg-[#fed011] text-black shadow-2xs font-bold'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="policy-title-input"
                type="text"
                placeholder="e.g. Privacy Policy"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFormError('');
                }}
                className="w-full pl-8.5 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
          </div>

          {/* Content Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={content}
              onChange={(html) => {
                setContent(html);
                setFormError('');
              }}
              placeholder=""
              minHeight="140px"
              maxHeight="260px"
            />
          </div>

          {/* Sort Order Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Sort Order
            </label>
            <div className="relative">
              <ListOrdered className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="number"
                min="1"
                placeholder="1"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full pl-8.5 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleResetForm}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
            >
              {editingId ? 'Cancel' : 'Reset'}
            </button>
            <button
              type="submit"
              disabled={
                createPolicyMutation.isPending || updatePolicyMutation.isPending
              }
              className="flex-1 py-2 px-3 bg-[#fed011] hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              {createPolicyMutation.isPending ||
              updatePolicyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{editingId ? 'Updating...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.2]" />
                  <span>{editingId ? 'Update Policy' : 'Save Policy'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ======================================== */}
      {/* STATUS CONFIRMATION MODAL               */}
      {/* ======================================== */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Icon (Theme Matched) */}
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-amber-50 border border-amber-200/80 text-amber-500 shadow-2xs">
              <AlertCircle className="w-7 h-7 stroke-[2.2] text-amber-500" />
            </div>

            {/* Modal Content */}
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Change Status
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to change the status of{' '}
                <span className="font-bold text-slate-900">
                  Policy #{statusModal.policy?.id ?? statusModal.policy?._id}
                </span>{' '}
                to{' '}
                <span className="font-bold text-amber-600 capitalize">
                  {statusModal.nextStatus}
                </span>
                ?
              </p>
            </div>

            {/* Error Message if API fails */}
            {updateStatusMutation.isError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                {updateStatusMutation.error?.response?.data?.message ||
                  'Failed to update status. Please try again.'}
              </p>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={() => setStatusModal(null)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: statusModal.policy.id ?? statusModal.policy._id,
                    status: statusModal.nextStatus,
                  })
                }
                className="flex-1 py-2.5 px-3 bg-[#fed011] hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================== */}
      {/* DELETE CONFIRMATION MODAL               */}
      {/* ======================================== */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Icon (Rose / Danger Theme) */}
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-rose-50 border border-rose-200/80 text-rose-500 shadow-2xs">
              <Trash2 className="w-7 h-7 stroke-[2.2] text-rose-500" />
            </div>

            {/* Modal Content */}
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Delete Privacy Policy
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-bold text-slate-900">
                  "{deleteModal.title}"
                </span>{' '}
                (ID: #{deleteModal.id ?? deleteModal._id})?
              </p>
            </div>

            {/* Error Message if API fails */}
            {deletePolicyMutation.isError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                {deletePolicyMutation.error?.response?.data?.message ||
                  'Failed to delete policy. Please try again.'}
              </p>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={deletePolicyMutation.isPending}
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletePolicyMutation.isPending}
                onClick={() =>
                  deletePolicyMutation.mutate(
                    deleteModal.id ?? deleteModal._id
                  )
                }
                className="flex-1 py-2.5 px-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deletePolicyMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
