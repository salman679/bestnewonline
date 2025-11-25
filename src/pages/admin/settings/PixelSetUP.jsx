import React, { useState } from 'react';
import { Card, Input, Button, message, Switch, Typography } from 'antd';
import { FacebookOutlined } from '@ant-design/icons';
import useFetchPixel from '../../../hooks/useFetchPixel';
import { axiosInstance } from '../../../lib/axiosInstance';

const { Title, Text } = Typography;

const PixelSetup = () => {
  const [pixelId, setPixelId] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const { data, loading: fetchLoading } = useFetchPixel();
  const [hasExistingPixel, setHasExistingPixel] = useState(false);
  const [pixelData, setPixelData] = useState(null);

  // Update local state when data is fetched
  React.useEffect(() => {
    if (data) {
      setPixelId(data.pixelId?.toString() || '');
      setIsEnabled(data.status === 'active');
      setHasExistingPixel(!!data.pixelId);
      setPixelData(data);
    }
  }, [data]);

  const handleStatusChange = async (checked) => {
    setSwitchLoading(true);
    try {
      const newStatus = checked ? 'active' : 'inactive';
      const response = await axiosInstance.put('/facebook-pixel', {
        ...pixelData,
        status: newStatus,
        pixelId: parseInt(pixelId),
      });

      if (response.data) {
        setIsEnabled(checked);
        setPixelData({
          ...pixelData,
          status: newStatus
        });
        message.success(`Facebook Pixel ${checked ? 'activated' : 'deactivated'} successfully!`);
      }
    } catch (err) {
      message.error('Failed to update Facebook Pixel status');
      setIsEnabled(!checked);
    } finally {
      setSwitchLoading(false);
    }
  };

  const handleSave = async () => {
    if (!pixelId.trim()) {
      message.error('Please enter a valid Facebook Pixel ID');
      return;
    }

    setLoading(true);
    
    try {
      if (hasExistingPixel) {
        const response = await axiosInstance.put('/facebook-pixel', {
          ...pixelData,
          pixelId: parseInt(pixelId),
          status: isEnabled ? 'active' : 'inactive'
        });

        if (response.data) {
          setPixelData(response.data);
          message.success('Facebook Pixel settings updated successfully!');
        }
      } else {
        const response = await axiosInstance.post('/facebook-pixel', {
          pixelId: parseInt(pixelId),
          status: 'inactive'
        });

        if (response.data) {
          setHasExistingPixel(true);
          setIsEnabled(false);
          setPixelData(response.data);
          message.success('Facebook Pixel created successfully!');
        }
      }
    } catch (err) {
      message.error(hasExistingPixel ? 'Failed to update Pixel settings' : 'Failed to create Pixel');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        Loading pixel settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-[640px]:p-4">
      <div className="max-w-4xl mx-auto">
        <Card
          className="overflow-hidden"
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            border: 'none'
          }}
        >
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FacebookOutlined style={{ fontSize: 32, color: '#1877F2' }} />
            </div>
            <Title level={2} style={{ margin: 0, color: '#1E293B' }}>Facebook Pixel Setup</Title>
            <Text className="mt-2 block text-gray-500">
              Track website events and optimize your ad campaigns
            </Text>
          </div>

          {/* Status Card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Title level={4} style={{ margin: 0, marginBottom: '8px', color: '#1E293B' }}>
                  Pixel Status
                </Title>
                <Text className="text-gray-600">
                  {hasExistingPixel 
                    ? `Your pixel is currently ${isEnabled ? 'tracking' : 'not tracking'} events`
                    : 'Set up your pixel to start tracking'}
                </Text>
              </div>
              <Switch
                checked={isEnabled}
                onChange={handleStatusChange}
                loading={switchLoading}
                disabled={!hasExistingPixel || switchLoading}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                style={{ 
                  backgroundColor: isEnabled ? '#1877F2' : undefined,
                  minWidth: '80px'
                }}
              />
            </div>
          </div>

          {/* Pixel ID Input Section */}
          <div className="mb-8">
            <Title level={4} style={{ marginBottom: '16px', color: '#1E293B' }}>Pixel ID</Title>
            <Input
              size="large"
              placeholder="Enter your Facebook Pixel ID (e.g., 1256260392555557)"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              prefix={
                <FacebookOutlined 
                  style={{ 
                    color: '#1877F2',
                    fontSize: '18px',
                    marginRight: '8px'
                  }} 
                />
              }
              style={{
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            />
            <Text type="secondary" className="text-sm">
              Find your Pixel ID in Facebook Events Manager
            </Text>
          </div>

          {/* Action Button */}
          <div className="text-center mb-8">
            <Button
              type="primary"
              size="large"
              onClick={handleSave}
              loading={loading}
              icon={<FacebookOutlined />}
              style={{
                backgroundColor: '#1877F2',
                borderRadius: '8px',
                height: '48px',
                paddingLeft: '32px',
                paddingRight: '32px',
                fontSize: '16px'
              }}
            >
              {hasExistingPixel ? 'Update Pixel Settings' : 'Create Pixel'}
            </Button>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <Title level={4} style={{ margin: 0, color: '#1E293B' }}>How to find your Pixel ID?</Title>
            </div>
            <ol className="space-y-3 text-gray-600 ml-6">
              <li className="flex items-center gap-2">
                <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <span>Go to Facebook Events Manager</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <span>Select your Pixel from the Data Sources</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <span>Click on Settings</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-medium">4</span>
                </div>
                <span>Your Pixel ID will be displayed at the top of the page</span>
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PixelSetup;
