import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Link, 
  Copy, 
  ExternalLink, 
  BarChart3, 
  Trash2, 
  Calendar,
  MousePointer,
  Globe,
  Zap
} from 'lucide-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = ' https://url-project-upvm.onrender.com';

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [description, setDescription] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);

  // Fetch all URLs on component mount
  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/urls`);
      if (response.data.success) {
        setShortenedUrls(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to fetch URLs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/urls/shorten`, {
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || undefined,
        description: description.trim()
      });

      if (response.data.success) {
        toast.success('URL shortened successfully!');
        setOriginalUrl('');
        setCustomAlias('');
        setDescription('');
        fetchUrls(); // Refresh the list
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to shorten URL';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url) => {
    toast.success('URL copied to clipboard!');
  };

  const handleDelete = async (shortCode) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/urls/${shortCode}`);
      if (response.data.success) {
        toast.success('URL deleted successfully');
        fetchUrls();
      }
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const fetchAnalytics = async (shortCode) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/analytics/${shortCode}`);
      if (response.data.success) {
        setAnalytics(response.data.data);
        setSelectedUrl(shortCode);
      }
    } catch (error) {
      toast.error('Failed to fetch analytics');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Link className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinkShort
              </h1>
              <p className="text-sm text-gray-600">Professional URL Shortener</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="shorten" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="shorten" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Shorten URL
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shorten" className="space-y-6">
            {/* URL Shortener Form */}
            <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Shorten Your URL</CardTitle>
                <CardDescription>
                  Create short, memorable links that are easy to share
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Original URL *</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/very-long-url"
                      value={originalUrl}
                      onChange={(e) => setOriginalUrl(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="alias">Custom Alias (optional)</Label>
                    <Input
                      id="alias"
                      placeholder="my-custom-link"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add a description for this link..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Shortening...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Shorten URL
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent URLs */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">Recent URLs</h2>
              <div className="grid gap-4 max-w-4xl mx-auto">
                {shortenedUrls.map((url) => (
                  <Card key={url.shortCode} className="shadow-md hover:shadow-lg transition-shadow duration-200 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <p className="text-sm text-gray-600 truncate">
                              {url.originalUrl}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Link className="h-4 w-4 text-blue-500" />
                            <a 
                              href={url.shortUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {url.shortUrl}
                            </a>
                          </div>
                          {url.description && (
                            <p className="text-sm text-gray-600 mb-2">{url.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MousePointer className="h-3 w-3" />
                              {url.clicks} clicks
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(url.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CopyToClipboard text={url.shortUrl} onCopy={() => handleCopy(url.shortUrl)}>
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </CopyToClipboard>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => fetchAnalytics(url.shortCode)}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(url.shortCode)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {shortenedUrls.length === 0 && (
                  <Card className="text-center py-12 bg-white/50">
                    <CardContent>
                      <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No URLs shortened yet</p>
                      <p className="text-sm text-gray-500">Create your first short link above</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analytics ? (
              <div className="max-w-4xl mx-auto space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Analytics for {analytics.url.shortCode}
                    </CardTitle>
                    <CardDescription>
                      Detailed statistics for your shortened URL
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {analytics.analytics.totalClicks}
                        </div>
                        <div className="text-sm text-gray-600">Total Clicks</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {Object.keys(analytics.analytics.clicksByDate).length}
                        </div>
                        <div className="text-sm text-gray-600">Active Days</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {Object.keys(analytics.analytics.referrers).length}
                        </div>
                        <div className="text-sm text-gray-600">Referrers</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">URL Details</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Original URL:</strong> {analytics.url.originalUrl}</div>
                        <div><strong>Short URL:</strong> {analytics.url.shortUrl}</div>
                        <div><strong>Created:</strong> {formatDate(analytics.url.createdAt)}</div>
                        {analytics.url.description && (
                          <div><strong>Description:</strong> {analytics.url.description}</div>
                        )}
                      </div>
                    </div>

                    {analytics.analytics.recentClicks.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Recent Clicks</h3>
                        <div className="space-y-2">
                          {analytics.analytics.recentClicks.map((click, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                              <div>{formatDate(click.timestamp)}</div>
                              <Badge variant="secondary">{click.referer || 'Direct'}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12 max-w-2xl mx-auto bg-white/50">
                <CardContent>
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No analytics selected</p>
                  <p className="text-sm text-gray-500">
                    Click the analytics button on any URL to view detailed statistics
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UrlShortener;
