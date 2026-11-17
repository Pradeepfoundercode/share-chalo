import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HelpCircle,
  Plus,
  Save,
  X,
  FileQuestion,
  Layers,
  ListOrdered,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import Pagination from '../common/Pagination';
import {
  getFaqsApi,
  createFaqApi,
  updateFaqApi,
  getFaqByIdApi,
  updateFaqStatusApi,
  deleteFaqApi,
} from '../../services/faq.services';

export default function FaqTab() {
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState('all');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);

  const [formRoleDropdownOpen, setFormRoleDropdownOpen] = useState(false);
  const formRoleDropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Close dropdown on outside click
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

  // Form State for Add / Edit FAQ
  const [editingId, setEditingId] = useState(null);
  const [fetchingFaqId, setFetchingFaqId] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [role, setRole] = useState('all');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sortOrder, setSortOrder] = useState('1');
  const [formError, setFormError] = useState('');

  // ========================================
  // GET FAQS API QUERY
  // ========================================
  const {
    data: faqsResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['faqs', currentPage, entriesPerPage],
    queryFn: () =>
      getFaqsApi({
        page: currentPage,
        limit: entriesPerPage,
      }),
  });

  const faqs = faqsResponse?.data || [];
  const meta = faqsResponse?.meta;

  // Filter by role: all | driver | user
  const filteredFaqs =
    roleFilter && roleFilter !== 'all'
      ? faqs.filter(
          (faq) => (faq.role || '').toLowerCase() === roleFilter.toLowerCase()
        )
      : faqs;

  const totalItems =
    roleFilter && roleFilter !== 'all'
      ? filteredFaqs.length
      : (meta?.total ?? faqs.length);
  const totalPages = Math.max(1, Math.ceil(totalItems / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const displayFaqs =
    roleFilter && roleFilter !== 'all'
      ? filteredFaqs.slice(
          (safePage - 1) * entriesPerPage,
          safePage * entriesPerPage
        )
      : filteredFaqs;

  // ========================================
  // CREATE FAQ API MUTATION
  // ========================================
  const createFaqMutation = useMutation({
    mutationFn: createFaqApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success(res?.message || 'FAQ created successfully!');
      handleResetForm();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || 'Failed to create FAQ. Please try again.';
      setFormError(msg);
      toast.error(msg);
    },
  });

  // ========================================
  // UPDATE FAQ API MUTATION
  // ========================================
  const updateFaqMutation = useMutation({
    mutationFn: updateFaqApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success(res?.message || 'FAQ updated successfully!');
      handleResetForm();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || 'Failed to update FAQ. Please try again.';
      setFormError(msg);
      toast.error(msg);
    },
  });

  // ========================================
  // UPDATE FAQ STATUS API
  // ========================================
  const updateStatusMutation = useMutation({
    mutationFn: updateFaqStatusApi,
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: ['faqs'],
        });
        toast.success(response?.message || 'Status updated successfully');
        setStatusModal(null);
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || 'Failed to update FAQ status.'
      );
    },
  });

  // ========================================
  // DELETE FAQ API MUTATION
  // ========================================
  const deleteFaqMutation = useMutation({
    mutationFn: deleteFaqApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success(res?.message || 'FAQ deleted successfully!');
      const deletedId = deleteModal?.id ?? deleteModal?._id;
      setDeleteModal(null);
      if (editingId && editingId === deletedId) {
        handleResetForm();
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || 'Failed to delete FAQ. Please try again.'
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
    setQuestion('');
    setAnswer('');
    setSortOrder(String((meta?.total ?? faqs.length) + 1));
    setFormError('');
  };

  const handleEdit = async (faq) => {
    const id = faq.id ?? faq._id;
    if (!id) return;
    setFetchingFaqId(id);
    setFormError('');
    try {
      const res = await getFaqByIdApi(id);
      const faqData = res?.data || faq;
      setEditingId(faqData.id ?? faqData._id ?? id);
      setRole((faqData.role || 'all').toLowerCase());
      setFormRoleDropdownOpen(false);
      setQuestion(faqData.question || '');
      setAnswer(faqData.answer || '');
      setSortOrder(String(faqData.sortOrder ?? 1));
      const formEl = document.getElementById('faq-form-card');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to fetch FAQ details.'
      );
    } finally {
      setFetchingFaqId(null);
    }
  };

  const handleSaveFaq = (e) => {
    e?.preventDefault();

    if (!question.trim()) {
      setFormError('Please enter a FAQ question.');
      return;
    }

    if (!answer.trim()) {
      setFormError('Please enter a FAQ answer.');
      return;
    }

    setFormError('');

    const payload = {
      role: role.trim(),
      question: question.trim(),
      answer: answer.trim(),
      sortOrder: Number(sortOrder) || 1,
    };

    if (editingId) {
      updateFaqMutation.mutate({ id: editingId, ...payload });
    } else {
      createFaqMutation.mutate(payload);
    }
  };

  const toggleExpand = (id) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  // Helper for role badges: user | driver | all
  const renderRoleBadge = (r) => {
    const cleanRole = (r || 'all').toLowerCase();
    switch (cleanRole) {
      case 'driver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
            driver
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200/80">
            user
          </span>
        );
      case 'all':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/80">
            all
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
      {/* ----------------- LEFT: FAQs List Table (col-span-8) ----------------- */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-3.5">
        {/* Header + Role Filter + Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-bold text-black leading-tight">
                FAQs List
              </h2>
              {isFetching && (
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Manage frequently asked questions displayed in the mobile apps.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            {/* Custom Role Filter Dropdown (Styled like Drivers Table) */}
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

              {/* Custom Dropdown Menu */}
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

            {/* Focus Add FAQ Form Button */}
            <button
              onClick={() => {
                document.getElementById('faq-question-input')?.focus();
                document
                  .getElementById('faq-form-card')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#fed011] hover:bg-amber-400 text-black px-3.5 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.4]" />
              <span>Add FAQ</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-left border-collapse">
              <thead>
                <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-[12px] sm:text-[13px] font-bold text-slate-900">
                  <th className="py-2.5 px-3 pl-4 text-center w-12 sm:w-14">#</th>
                  <th className="py-2.5 px-3 w-24">Role</th>
                  <th className="py-2.5 px-3">Question & Answer</th>
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
                          Loading FAQs...
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
                          {error?.response?.data?.message || 'Failed to load FAQs.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : displayFaqs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <HelpCircle className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <p className="font-bold text-sm text-slate-600">
                          No FAQs Found
                        </p>
                        <p className="text-xs text-slate-400 max-w-sm">
                          {roleFilter !== 'all'
                            ? `No FAQs found for role "${roleFilter}". Try selecting "all".`
                            : 'Create your first FAQ using the form on the right.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayFaqs.map((faq, index) => {
                    const faqId = faq.id ?? faq._id;
                    const isExpanded = expandedFaqId === faqId;
                    const isActive = (faq.status || 'active').toLowerCase() === 'active';

                    return (
                      <tr
                        key={faqId ?? index}
                        className="hover:bg-slate-50/70 transition-colors align-top"
                      >
                        {/* ID from API */}
                        <td className="py-3 px-3 pl-4 text-center text-slate-900 font-bold text-xs sm:text-sm">
                          {faq.id ?? faq._id ?? '-'}
                        </td>

                        {/* Role Badge */}
                        <td className="py-3 px-3">
                          {renderRoleBadge(faq.role)}
                        </td>

                        {/* Question & Expandable Answer */}
                        <td className="py-2.5 px-3">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-slate-900 text-sm sm:text-[14px] leading-tight">
                                {faq.question}
                              </p>
                              {faq.answer && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(faqId)}
                                  className="p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                                  title={isExpanded ? 'Hide Answer' : 'Show Answer'}
                                >
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Answer text: Only shown when arrow is clicked, tight gap */}
                            {isExpanded && faq.answer && (
                              <p className="mt-1 text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                                {faq.answer}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Sort Order */}
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                            {faq.sortOrder ?? '-'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const current = (faq.status || 'active').toLowerCase();
                              const next = current === 'active' ? 'inactive' : 'active';
                              setStatusModal({
                                faq,
                                currentStatus: current,
                                nextStatus: next,
                              });
                            }}
                            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer hover:shadow-2xs active:scale-95 ${
                              isActive
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70'
                                : 'text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100/70'
                            }`}
                            title={`Click to change status to ${isActive ? 'Inactive' : 'Active'}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                isActive ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span className="capitalize">{faq.status || 'Active'}</span>
                          </button>
                        </td>

                        {/* Action */}
                        <td className="py-2.5 px-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(faq)}
                              disabled={fetchingFaqId === faqId}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
                              title="Edit FAQ"
                            >
                              {fetchingFaqId === faqId ? (
                                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                              ) : (
                                <Pencil className="w-4 h-4 stroke-[2]" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteModal(faq)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete FAQ"
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

      {/* ----------------- RIGHT: Add / Edit FAQ Form Card (col-span-4) ----------------- */}
      <div
        id="faq-form-card"
        className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-4 space-y-3 self-start"
      >
        {/* Card Header */}
        <div className="flex items-center pb-2.5 border-b border-slate-100">
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
                {editingId ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                {editingId
                  ? 'Update question & answer'
                  : 'Create question & answer'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {formError && (
          <div className="flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-semibold animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSaveFaq} className="space-y-2.5">
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

          {/* Question Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Question <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileQuestion className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
              <textarea
                id="faq-question-input"
                rows={2}
                placeholder="e.g. How do I contact support?"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  setFormError('');
                }}
                className="w-full pl-8.5 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
              />
            </div>
          </div>

          {/* Answer Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Enter answer here..."
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setFormError('');
              }}
              className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-y min-h-[78px]"
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
              disabled={createFaqMutation.isPending || updateFaqMutation.isPending}
              className="flex-1 py-2 px-3 bg-[#fed011] hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              {createFaqMutation.isPending || updateFaqMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{editingId ? 'Updating...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.2]" />
                  <span>{editingId ? 'Update FAQ' : 'Save FAQ'}</span>
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
                  FAQ #{statusModal.faq?.id ?? statusModal.faq?._id}
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
                    id: statusModal.faq.id ?? statusModal.faq._id,
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
                Delete FAQ
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-bold text-slate-900">
                  FAQ #{deleteModal.id ?? deleteModal._id}
                </span>
                ?
              </p>
            </div>

            {/* Error Message if API fails */}
            {deleteFaqMutation.isError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                {deleteFaqMutation.error?.response?.data?.message ||
                  'Failed to delete FAQ. Please try again.'}
              </p>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={deleteFaqMutation.isPending}
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteFaqMutation.isPending}
                onClick={() =>
                  deleteFaqMutation.mutate(deleteModal.id ?? deleteModal._id)
                }
                className="flex-1 py-2.5 px-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleteFaqMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
