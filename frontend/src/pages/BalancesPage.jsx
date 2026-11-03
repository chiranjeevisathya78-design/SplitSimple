import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Loader2,
  Scale,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { groupService } from '../services';
import { formatCurrency, getInitials } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export default function BalancesPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [groupBalances, setGroupBalances] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupsAndBalances();
  }, []);

  const fetchGroupsAndBalances = async () => {
    setLoading(true);
    try {
      const res = await groupService.getAll();
      const groupList = res.data.data.groups || res.data.data || [];
      setGroups(groupList);

      // Fetch balances for each group
      const balancesMap = {};
      await Promise.all(
        groupList.map(async (group) => {
          try {
            const balRes = await groupService.getBalances(group._id);
            balancesMap[group._id] = balRes.data.data.balances || balRes.data.data || [];
          } catch {
            balancesMap[group._id] = [];
          }
        })
      );
      setGroupBalances(balancesMap);
    } catch (err) {
      toast.error('Failed to load balances');
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall summary
  const calculateSummary = () => {
    let totalOwed = 0; // positive = others owe you
    let totalOwe = 0; // negative = you owe others

    Object.values(groupBalances).forEach((balances) => {
      balances.forEach((bal) => {
        const userId = bal.user?._id || bal.user;
        if (userId === user?._id) {
          const amount = bal.balance || bal.amount || 0;
          if (amount > 0) totalOwed += amount;
          else totalOwe += Math.abs(amount);
        }
      });
    });

    return { totalOwed, totalOwe, net: totalOwed - totalOwe };
  };

  const summary = !loading ? calculateSummary() : { totalOwed: 0, totalOwe: 0, net: 0 };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Balances</h1>
        <p className="text-gray-500 mt-1">See who owes what across all groups</p>
      </div>

      {/* Overall Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">You Owe</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalOwe)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">You Are Owed</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(summary.totalOwed)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Net Balance</span>
          </div>
          <p
            className={`text-2xl font-bold ${
              summary.net >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {summary.net >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(summary.net))}
          </p>
        </div>
      </div>

      {/* Group-wise Breakdown */}
      {groups.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No groups yet</h3>
          <p className="text-gray-500 mb-6">Create a group to start tracking balances</p>
          <Link
            to="/groups/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Create Group
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => {
            const balances = groupBalances[group._id] || [];
            return (
              <div
                key={group._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-500">
                        {group.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/settlements?groupId=${group._id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Settlements
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {balances.length === 0 ? (
                  <div className="p-5 text-center text-sm text-gray-500">
                    All settled up! 🎉
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {balances.map((bal, idx) => {
                      const name = bal.user?.name || 'Unknown';
                      const balAmount = bal.balance || bal.amount || 0;
                      const isPositive = balAmount > 0;
                      const isCurrentUser =
                        (bal.user?._id || bal.user) === user?._id;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-5 py-3 ${
                            isCurrentUser ? 'bg-indigo-50/50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                isPositive ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            >
                              {getInitials(name)}
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {name}
                              {isCurrentUser && (
                                <span className="text-indigo-600 ml-1">(You)</span>
                              )}
                            </span>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-sm font-semibold ${
                                isPositive ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {isPositive ? 'is owed ' : 'owes '}
                              {formatCurrency(Math.abs(balAmount))}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
