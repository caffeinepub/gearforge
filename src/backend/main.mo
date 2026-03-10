import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Product = {
    id : Nat;
    name : Text;
    category : Text; // "GPU", "Monitor", "Peripheral", "Headset", "Controller"
    price : Float;
    description : Text;
    specs : [(Text, Text)]; // key-value pairs
    inStock : Bool;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };

    public func compareByPriceLowToHigh(p1 : Product, p2 : Product) : Order.Order {
      Float.compare(p1.price, p2.price);
    };
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type Cart = List.List<CartItem>;

  public type UserProfile = {
    name : Text;
  };

  let products = Map.fromIter<Nat, Product>(
    [
      (
        1,
        {
          id = 1;
          name = "NVIDIA GeForce RTX 3080";
          category = "GPU";
          price = 699.99;
          description = "High-performance GPU for gaming and rendering.";
          specs = [("VRAM", "10GB"), ("Cores", "8704"), ("Clock Speed", "1.71 GHz")];
          inStock = true;
        },
      ),
      (
        2,
        {
          id = 2;
          name = "ASUS ROG Swift PG259QN";
          category = "Monitor";
          price = 599.99;
          description = "24.5-inch, 360Hz gaming monitor with IPS panel.";
          specs = [("Resolution", "1920x1080"), ("Refresh Rate", "360Hz"), ("Panel", "IPS")];
          inStock = true;
        },
      ),
      (
        3,
        {
          id = 3;
          name = "Logitech G Pro X Superlight";
          category = "Peripheral";
          price = 149.99;
          description = "Ultra-lightweight wireless gaming mouse.";
          specs = [("Weight", "63g"), ("Sensor", "HERO 25K"), ("Buttons", "5")];
          inStock = true;
        },
      ),
      (
        4,
        {
          id = 4;
          name = "SteelSeries Arctis Pro Wireless";
          category = "Headset";
          price = 329.99;
          description = "High-fidelity wireless gaming headset with dual battery system.";
          specs = [("Battery Life", "20 hours"), ("Drivers", "40mm"), ("Wireless Range", "12m")];
          inStock = true;
        },
      ),
      (
        5,
        {
          id = 5;
          name = "Xbox Elite Wireless Controller Series 2";
          category = "Controller";
          price = 179.99;
          description = "Premium customizable wireless controller.";
          specs = [("Battery Life", "40 hours"), ("Connectivity", "Bluetooth"), ("Adjustable Triggers", "Yes")];
          inStock = true;
        },
      ),
      (
        6,
        {
          id = 6;
          name = "AMD Radeon RX 6800 XT";
          category = "GPU";
          price = 649.99;
          description = "Powerful GPU for 4K gaming.";
          specs = [("VRAM", "16GB"), ("Cores", "4608"), ("Clock Speed", "2.25 GHz")];
          inStock = true;
        },
      ),
      (
        7,
        {
          id = 7;
          name = "Dell Alienware AW3821DW";
          category = "Monitor";
          price = 1499.99;
          description = "38-inch curved ultrawide gaming monitor.";
          specs = [("Resolution", "3840x1600"), ("Refresh Rate", "144Hz"), ("Panel", "IPS")];
          inStock = true;
        },
      ),
      (
        8,
        {
          id = 8;
          name = "Razer Huntsman Elite";
          category = "Peripheral";
          price = 199.99;
          description = "Mechanical gaming keyboard with RGB lighting.";
          specs = [("Switch Type", "Opto-Mechanical"), ("Backlight", "RGB"), ("Wrist Rest", "Magnetic")];
          inStock = true;
        },
      ),
      (
        9,
        {
          id = 9;
          name = "HyperX Cloud II Wireless";
          category = "Headset";
          price = 149.99;
          description = "Comfortable wireless gaming headset.";
          specs = [("Battery Life", "30 hours"), ("Frequency Response", "15Hz-20kHz"), ("Mic", "Detachable")];
          inStock = true;
        },
      ),
      (
        10,
        {
          id = 10;
          name = "Sony DualSense Wireless Controller";
          category = "Controller";
          price = 69.99;
          description = "Innovative controller for PlayStation 5.";
          specs = [("Haptic Feedback", "Yes"), ("Adaptive Triggers", "Yes"), ("Battery Life", "12 hours")];
          inStock = true;
        },
      ),
      (
        11,
        {
          id = 11;
          name = "NVIDIA GeForce RTX 3060";
          category = "GPU";
          price = 329.99;
          description = "Affordable GPU for entry-level gaming.";
          specs = [("VRAM", "12GB"), ("Cores", "3584"), ("Clock Speed", "1.78 GHz")];
          inStock = true;
        },
      ),
      (
        12,
        {
          id = 12;
          name = "LG UltraGear 27GN950-B";
          category = "Monitor";
          price = 799.99;
          description = "27-inch 4K gaming monitor with high refresh rate.";
          specs = [("Resolution", "3840x2160"), ("Refresh Rate", "144Hz"), ("Panel", "IPS")];
          inStock = true;
        },
      ),
    ].values(),
  );

  let carts = Map.empty<Principal, Cart>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getUserCart(caller : Principal) : Cart {
    switch (carts.get(caller)) {
      case (?cart) { cart };
      case (null) { List.empty<CartItem>() };
    };
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product queries - accessible to everyone including guests
  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(p) {
        Text.equal(p.category, category);
      }
    ).sort();
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  // Cart operations - require user authentication
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than zero");
    };

    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };

    if (not product.inStock) {
      Runtime.trap("Product is not in stock");
    };

    let currentCart = getUserCart(caller);
    let existingItem = currentCart.find(
      func(item) {
        item.productId == productId;
      }
    );

    let newCart = switch (existingItem) {
      case (null) {
        let newItem : CartItem = {
          productId;
          quantity;
        };
        let cartArray = currentCart.toArray().concat([newItem]);
        List.fromArray<CartItem>(cartArray);
      };
      case (?existing) {
        currentCart.map<CartItem, CartItem>(
          func(item) {
            if (item.productId == productId) {
              {
                productId = item.productId;
                quantity = item.quantity + quantity;
              };
            } else {
              item;
            };
          }
        );
      };
    };

    carts.add(caller, newCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };

    let currentCart = getUserCart(caller);
    let cartArray = currentCart.toArray();
    let filteredArray = cartArray.filter(
      func(item) {
        item.productId != productId;
      }
    );

    if (cartArray.size() == filteredArray.size()) {
      Runtime.trap("Product not found in cart");
    };

    let newCart = List.fromArray<CartItem>(filteredArray);
    carts.add(caller, newCart);
  };

  public shared ({ caller }) func updateCartQuantity(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart quantities");
    };

    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than zero");
    };

    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };

    if (not product.inStock) {
      Runtime.trap("Product is not in stock");
    };

    let currentCart = getUserCart(caller);
    let foundItem = currentCart.find(
      func(item) {
        item.productId == productId;
      }
    );

    if (foundItem == null) {
      Runtime.trap("Product not found in cart");
    };

    let cartArray = currentCart.toArray();
    let mappedArray = cartArray.map(
      func(item) {
        if (item.productId == productId) {
          {
            productId = item.productId;
            quantity;
          };
        } else {
          item;
        };
      }
    );
    let newCart = List.fromArray<CartItem>(mappedArray);
    carts.add(caller, newCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };

    let cart = getUserCart(caller);
    cart.toArray();
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear their cart");
    };

    carts.add(caller, List.empty<CartItem>());
  };
};
