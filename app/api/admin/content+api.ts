import { contentAPI } from '@/lib/api';
import { verifyAdminToken } from '@/lib/api';

export async function GET(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify admin token
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get content type from query params
    const url = new URL(request.url);
    const contentType = url.searchParams.get('type');
    
    let content;
    if (contentType === 'auctions') {
      content = await contentAPI.getAllAuctions();
    } else if (contentType === 'categories') {
      content = await contentAPI.getAllCategories();
    } else {
      // Get all content types
      const auctions = await contentAPI.getAllAuctions();
      const categories = await contentAPI.getAllCategories();
      content = { auctions, categories };
    }

    return new Response(JSON.stringify(content), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to get content:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify admin token
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get request body
    const { contentType, data } = await request.json();
    
    if (!contentType || !data) {
      return new Response(JSON.stringify({ error: 'Content type and data are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create content based on type
    let newContent;
    if (contentType === 'auction') {
      newContent = await contentAPI.createAuction(data, token);
    } else if (contentType === 'category') {
      newContent = await contentAPI.createCategory(data, token);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(newContent), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to create content:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify admin token
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get request body
    const { contentType, id, data } = await request.json();
    
    if (!contentType || !id || !data) {
      return new Response(JSON.stringify({ error: 'Content type, ID, and data are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update content based on type
    let updatedContent;
    if (contentType === 'auction') {
      updatedContent = await contentAPI.updateAuction(id, data, token);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updatedContent), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update content:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify admin token
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get content type and ID from query params
    const url = new URL(request.url);
    const contentType = url.searchParams.get('type');
    const id = url.searchParams.get('id');
    
    if (!contentType || !id) {
      return new Response(JSON.stringify({ error: 'Content type and ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete content based on type
    if (contentType === 'auction') {
      await contentAPI.deleteAuction(id, token);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to delete content:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}