# Authentication Error Handler

This guide shows how to handle 401 authentication errors by automatically showing a login modal.

## Components Created

1. **`useAuthErrorHandler` Hook** - Handles 401 errors and shows login modal
2. **Updated Booking Component** - Example implementation
3. **Examples** - Additional use cases

## Usage

### Basic Usage

```tsx
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';
import LoginModal from '@/components/modals/LoginModal';

const MyComponent = () => {
  const [error, setError] = useState<string | null>(null);
  
  const { showLoginModal, authError, handleApiError, closeLoginModal } = useAuthErrorHandler({
    customUnauthorizedMessage: "Please log in to continue.",
    onLoginSuccess: () => {
      // Optional: Retry the failed operation
      console.log("User logged in successfully");
    }
  });

  const performApiCall = async () => {
    try {
      const response = await fetch('/api/protected-endpoint');
      if (!response.ok) {
        throw { response: { status: response.status } };
      }
      // Handle success
    } catch (err) {
      if (!handleApiError(err)) {
        // Handle other types of errors
        setError("Something went wrong");
      }
    }
  };

  return (
    <div>
      {(error || authError) && (
        <div className="text-red-600">{error || authError}</div>
      )}
      
      <button onClick={performApiCall}>Perform Action</button>
      
      <LoginModal open={showLoginModal} onClose={closeLoginModal} />
    </div>
  );
};
```

### Hook Options

```tsx
interface UseAuthErrorHandlerOptions {
  onLoginSuccess?: () => void;           // Called after successful login
  customUnauthorizedMessage?: string;   // Custom 401 error message
}
```

### Return Values

```tsx
const {
  showLoginModal,    // boolean - whether to show the login modal
  authError,         // string | null - the auth error message
  handleApiError,    // function - call this with your API error
  closeLoginModal,   // function - closes the modal and clears auth error
} = useAuthErrorHandler(options);
```

## Implementation Details

1. **Error Detection**: The hook checks for `error.response.status === 401`
2. **Modal Display**: Automatically shows login modal on 401 errors
3. **Error Messages**: Can customize the unauthorized message
4. **Post-Login Actions**: Optional callback after successful login
5. **Clean State**: Automatically clears errors when modal is closed

## Benefits

- **Consistent UX**: Same login flow across all components
- **Reusable**: One hook handles all 401 errors
- **Clean Code**: Separates auth logic from business logic
- **Type Safe**: Full TypeScript support
- **Flexible**: Customizable messages and callbacks

## Files Modified

- `src/app/(withCommonLayout)/properties/[id]/booking.tsx` - Example implementation
- `src/hooks/useAuthErrorHandler.ts` - Main hook
- `src/examples/AuthErrorHandlerExamples.tsx` - Usage examples

## Testing the Implementation

1. **Trigger 401 Error**: Make API call without valid token
2. **Verify Modal**: Login modal should appear automatically
3. **Login Process**: Complete login flow
4. **Post-Login**: Verify any post-login callbacks execute
5. **Error Clearing**: Ensure errors are cleared when modal closes
